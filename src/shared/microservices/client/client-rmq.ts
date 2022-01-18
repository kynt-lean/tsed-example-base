import { importPackage } from "@tsed/core";
import { EventEmitter } from "events";
import { EmptyError, first, fromEvent, lastValueFrom, map, merge, Observable, share, switchMap } from "rxjs";
import { randomStringGenerator } from "../../utils";
import { DISCONNECTED_RMQ_MESSAGE, DISCONNECT_EVENT, ERROR_EVENT, RQM_DEFAULT_IS_GLOBAL_PREFETCH_COUNT, RQM_DEFAULT_PERSISTENT, RQM_DEFAULT_PREFETCH_COUNT, RQM_DEFAULT_QUEUE, RQM_DEFAULT_QUEUE_OPTIONS, RQM_DEFAULT_URL, RQM_DEFAULT_NOACK } from "../constants";
import { RmqUrl } from "../external";
import { ReadPacket, RmqOptions, WritePacket } from "../interfaces";
import { RmqRecord } from "../record-builders";
import { RmqRecordSerializer } from "../serializers";
import { ClientProxy } from "./client-proxy";

let rmqPackage: any = {};

const REPLY_QUEUE = 'amq.rabbitmq.reply-to';

export class ClientRMQ extends ClientProxy {  
  protected connection: Promise<any>;
  protected client: any = null;
  protected channel: any = null;
  protected urls: string[] | RmqUrl;
  protected queue: string;
  protected queueOptions: any;
  protected responseEmitter: EventEmitter;
  protected replyQueue: string;
  protected persistent: boolean;  

  constructor(protected readonly options: RmqOptions['options']) {
    super();
    this.urls = [RQM_DEFAULT_URL];
    this.queue = RQM_DEFAULT_QUEUE;
    this.queueOptions = RQM_DEFAULT_QUEUE_OPTIONS;
    this.replyQueue = REPLY_QUEUE;
    if (options) {
      this.urls = this.getOptionsProp(options, 'urls', [RQM_DEFAULT_URL]);
      this.queue = this.getOptionsProp(options, 'queue', RQM_DEFAULT_QUEUE);
      this.queueOptions = this.getOptionsProp(options, 'queueOptions', RQM_DEFAULT_QUEUE_OPTIONS);
      this.replyQueue = this.getOptionsProp(options, 'replyQueue', REPLY_QUEUE);
      this.persistent = this.getOptionsProp(options, 'persistent', RQM_DEFAULT_PERSISTENT);
    }

    importPackage('amqplib');
    rmqPackage = importPackage('amqp-connection-manager');

    this.initializeSerializer(options);
    this.initializeDeserializer(options);
  }

  public connect(): Promise<any> {
    if (this.client) {
      return this.connection;
    }
    this.client = this.createClient();
    this.handleError(this.client);
    this.handleDisconnectError(this.client);

    const connect$ = this.connect$(this.client);
    this.connection = lastValueFrom(
      this.mergeDisconnectEvent(this.client, connect$).pipe(
        switchMap(() => this.createChannel()),
        share(),
      ),
    ).catch(err => {
      if (err instanceof EmptyError) {
        return;
      }
      throw err;
    });

    return this.connection;
  }

  public close(): void {
    this.channel && this.channel.close();
    this.client && this.client.close();
    this.channel = null;
    this.client = null;
  }

  public createClient<T = any>(): T {
    const socketOptions = this.options ? this.getOptionsProp(this.options, 'socketOptions') : undefined;
    return rmqPackage.connect(this.urls, {
      connectionOptions: socketOptions,
    }) as T;
  }

  public mergeDisconnectEvent<T = any>(
    instance: any,
    source$: Observable<T>,
  ): Observable<T> {
    const close$ = fromEvent(instance, DISCONNECT_EVENT).pipe(
      map((err: any) => {
        throw err;
      }),
    );
    return merge(source$, close$).pipe(first());
  }

  public createChannel(): Promise<void> {
    return new Promise(resolve => {
      this.channel = this.client.createChannel({
        json: false,
        setup: (channel: any) => this.setupChannel(channel, resolve),
      });
    });
  }

  public async setupChannel(channel: any, resolve: Function) {
    const prefetchCount = this.options ? this.getOptionsProp(this.options, 'prefetchCount', RQM_DEFAULT_PREFETCH_COUNT) : RQM_DEFAULT_PREFETCH_COUNT;
    const isGlobalPrefetchCount = this.options ? this.getOptionsProp(this.options, 'isGlobalPrefetchCount', RQM_DEFAULT_IS_GLOBAL_PREFETCH_COUNT) : RQM_DEFAULT_IS_GLOBAL_PREFETCH_COUNT;

    await channel.assertQueue(this.queue, this.queueOptions);
    await channel.prefetch(prefetchCount, isGlobalPrefetchCount);

    this.responseEmitter = new EventEmitter();
    this.responseEmitter.setMaxListeners(0);
    await this.consumeChannel(channel);
    resolve();
  }

  public async consumeChannel(channel: any) {
    const noAck = this.options ? this.getOptionsProp(this.options, 'noAck', RQM_DEFAULT_NOACK) : RQM_DEFAULT_NOACK;
    await channel.consume(
      this.replyQueue,
      (msg: any) =>
        this.responseEmitter.emit(msg.properties.correlationId, msg),
      {
        noAck,
      },
    );
  }

  public handleError(client: any): void {
    client.addListener(ERROR_EVENT, (err: any) => this.logger.error(err));
  }

  public handleDisconnectError(client: any): void {
    client.addListener(DISCONNECT_EVENT, (err: any) => {
      this.logger.error(DISCONNECTED_RMQ_MESSAGE);
      this.logger.error(err);

      this.close();
    });
  }

  public async handleMessage(
    packet: unknown,
    callback: (packet: WritePacket) => any,
  ) {
    const { err, response, isDisposed } = await this.deserializer.deserialize(
      packet,
    );
    if (isDisposed || err) {
      callback({
        err,
        response,
        isDisposed: true,
      });
    }
    callback({
      err,
      response,
    });
  }

  protected publish(
    message: ReadPacket,
    callback: (packet: WritePacket) => any,
  ): () => void {
    const correlationId = randomStringGenerator();
    const listener = ({ content }: { content: any }) =>
      this.handleMessage(JSON.parse(content.toString()), callback);

    Object.assign(message, { id: correlationId });
    const serializedPacket: ReadPacket & Partial<RmqRecord> =
      this.serializer.serialize(message);

    const options = serializedPacket.options;
    delete serializedPacket.options;

    this.responseEmitter.on(correlationId, listener);
    this.channel.sendToQueue(
      this.queue,
      Buffer.from(JSON.stringify(serializedPacket)),
      {
        replyTo: this.replyQueue,
        persistent: this.persistent,
        ...options,
        headers: this.mergeHeaders(options?.headers),
        correlationId,
      },
    );
    return () => this.responseEmitter.removeListener(correlationId, listener);
  }

  protected dispatchEvent(packet: ReadPacket): Promise<any> {
    const serializedPacket: ReadPacket & Partial<RmqRecord> =
      this.serializer.serialize(packet);

    return new Promise<void>((resolve, reject) =>
      this.channel.sendToQueue(
        this.queue,
        Buffer.from(JSON.stringify(serializedPacket)),
        {
          persistent: this.persistent,
          ...serializedPacket.options,
          headers: this.mergeHeaders(serializedPacket.options?.headers),
        },
        (err: unknown) => (err ? reject(err) : resolve()),
      ),
    );
  }

  protected initializeSerializer(options: RmqOptions['options']) {
    this.serializer = options?.serializer ?? new RmqRecordSerializer();
  }

  protected mergeHeaders(
    requestHeaders?: Record<string, string>,
  ): Record<string, string> | undefined {
    if (!requestHeaders && !this.options?.headers) {
      return undefined;
    }

    return {
      ...this.options?.headers,
      ...requestHeaders,
    };
  }
}