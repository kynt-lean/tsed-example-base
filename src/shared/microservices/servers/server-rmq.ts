import { Server } from "./server";
import { Transport } from "../enums";
import { RmqUrl } from "../external";
import { CustomTransportStrategy, IncomingRequest, OutgoingResponse, RmqOptions } from "../interfaces";
import {
  CONNECT_EVENT,
  DISCONNECTED_RMQ_MESSAGE,
  DISCONNECT_EVENT,
  RQM_DEFAULT_IS_GLOBAL_PREFETCH_COUNT,
  RQM_DEFAULT_PREFETCH_COUNT,
  RQM_DEFAULT_QUEUE,
  RQM_DEFAULT_QUEUE_OPTIONS,
  RQM_DEFAULT_URL,
  RQM_DEFAULT_NOACK,
  NO_MESSAGE_HANDLER
} from "../constants";
import { isNil, isString, isUndefined, loadPackage } from "../../utils";
import { RmqContext } from "../ctx-host";
import { RmqRecordSerializer } from "../serializers";
import { Logger } from "@tsed/common";

let rmqPackage: any = {};

export class ServerRMQ extends Server implements CustomTransportStrategy {
  public readonly transportId = Transport.RMQ;
  protected server: any = null;
  protected channel: any = null;
  protected readonly urls: string[] | RmqUrl[];
  protected readonly queue: string;
  protected readonly prefetchCount: number;
  protected readonly queueOptions: any;
  protected readonly isGlobalPrefetchCount: boolean;

  constructor(
    protected readonly logger: Logger,
    protected readonly options: RmqOptions['options']
  ) {
    super(logger);
    this.urls = [RQM_DEFAULT_URL];
    this.queue = RQM_DEFAULT_QUEUE;
    this.prefetchCount = RQM_DEFAULT_PREFETCH_COUNT;
    this.isGlobalPrefetchCount = RQM_DEFAULT_IS_GLOBAL_PREFETCH_COUNT;
    this.queueOptions = RQM_DEFAULT_QUEUE_OPTIONS;
    if (options) {
      this.urls = this.getOptionsProp(options, "urls", [RQM_DEFAULT_URL]);
      this.queue = this.getOptionsProp(options, "queue", RQM_DEFAULT_QUEUE);
      this.prefetchCount = this.getOptionsProp(options, "prefetchCount", RQM_DEFAULT_PREFETCH_COUNT);
      this.isGlobalPrefetchCount = this.getOptionsProp(options, "isGlobalPrefetchCount", RQM_DEFAULT_IS_GLOBAL_PREFETCH_COUNT);
      this.queueOptions = this.getOptionsProp(options, "queueOptions", RQM_DEFAULT_QUEUE_OPTIONS);
    }
    loadPackage('amqplib', ServerRMQ.name);
    rmqPackage = loadPackage('amqp-connection-manager', ServerRMQ.name);
    this.initializeSerializer(options);
    this.initializeDeserializer(options);
  }

  public async listen(
    callback: (err?: unknown, ...optionalParams: unknown[]) => void,
  ): Promise<void> {
    try {
      await this.start(callback);
    } catch (err) {
      callback(err);
    }
  }

  public close(): void {
    this.channel && this.channel.close();
    this.server && this.server.close();
  }

  public async start(callback?: () => void) {
    this.server = this.createClient();
    this.server.on(CONNECT_EVENT, () => {
      if (this.channel) {
        return;
      }
      this.channel = this.server.createChannel({
        json: false,
        setup: (channel: any) => this.setupChannel(channel, callback),
      });
    });
    this.server.on(DISCONNECT_EVENT, (err: any) => {
      this.logger.error(DISCONNECTED_RMQ_MESSAGE);
      this.logger.error(err);
    });
  }

  public createClient<T = any>(): T {
    const socketOptions = this.options ? this.getOptionsProp(this.options, 'socketOptions') : undefined;
    return rmqPackage.connect(this.urls, {
      connectionOptions: socketOptions,
      heartbeatIntervalInSeconds: socketOptions?.heartbeatIntervalInSeconds,
      reconnectTimeInSeconds: socketOptions?.reconnectTimeInSeconds,
    });
  }

  public async setupChannel(channel: any, callback?: Function) {
    const noAck = this.options ? this.getOptionsProp(this.options, 'noAck', RQM_DEFAULT_NOACK) : RQM_DEFAULT_NOACK;

    await channel.assertQueue(this.queue, this.queueOptions);
    await channel.prefetch(this.prefetchCount, this.isGlobalPrefetchCount);
    if (this.messageHandlers) {
      await channel.consume(
        this.queue,
        (msg: Record<string, any>) => this.handleMessage(msg, channel),
        {
          noAck,
        },
      );
    }
    if (callback) {
      callback();
    }
  }

  public async handleMessage(
    message: Record<string, any>,
    channel: any,
  ): Promise<void> {
    if (isNil(message)) {
      return;
    }
    const { content, properties } = message;
    const rawMessage = JSON.parse(content.toString());
    const packet = await this.deserializer.deserialize(rawMessage);
    const pattern = isString(packet.pattern)
      ? packet.pattern
      : JSON.stringify(packet.pattern);

    const rmqContext = new RmqContext([message, channel, pattern]);
    if (isUndefined((packet as IncomingRequest).id)) {
      return this.handleEvent(pattern, packet, rmqContext);
    }
    const handler = this.getHandlerByPattern(pattern);

    if (!handler) {
      const status = 'error';
      const noHandlerPacket = {
        id: (packet as IncomingRequest).id,
        err: NO_MESSAGE_HANDLER,
        status,
      };
      return this.sendMessage(
        noHandlerPacket,
        properties.replyTo,
        properties.correlationId,
      );
    }
    const response$ = this.transformToObservable(
      await handler(packet.data, rmqContext),
    );

    const publish = <T>(data: T) =>
      this.sendMessage(data, properties.replyTo, properties.correlationId);

    response$ && this.send(response$, publish);
  }

  public sendMessage<T = any>(
    message: T,
    replyTo: any,
    correlationId: string,
  ): void {
    const outgoingResponse = this.serializer.serialize(
      message as unknown as OutgoingResponse,
    );
    const options = outgoingResponse.options;
    delete outgoingResponse.options;

    const buffer = Buffer.from(JSON.stringify(outgoingResponse));
    this.channel.sendToQueue(replyTo, buffer, { correlationId, ...options });
  }

  protected initializeSerializer(options: RmqOptions['options']) {
    this.serializer = options?.serializer ?? new RmqRecordSerializer();
  }
}