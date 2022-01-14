import { Logger } from "@tsed/common";
import { connectable, EMPTY, from as fromPromise, isObservable, Observable, ObservedValueOf, of, Subject, Subscription } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { loadPackage } from "../../utils";
import { NO_EVENT_HANDLER } from "../constants";
import { BaseRpcContext } from "../ctx-host";
import { IncomingRequestDeserializer } from "../deserializers";
import { ConsumerDeserializer, ConsumerSerializer, MessageHandler, MsPattern, ReadPacket, WritePacket, RmqOptions, ClientOptions } from "../interfaces";
import { MicroserviceOptions } from "../interfaces/microservice-configuration.interface";
import { IdentitySerializer } from "../serializers";
import { transformPatternToRoute } from "../utils";

export abstract class Server {
  protected readonly messageHandlers = new Map<string, MessageHandler>();
  protected readonly logger: Logger = new Logger(Server.name);
  protected serializer: ConsumerSerializer;
  protected deserializer: ConsumerDeserializer;

  public addHandler(
    pattern: any,
    callback: MessageHandler,
    isEventHandler = false
  ) {
    const normalizedPattern = this.normalizePattern(pattern);
    callback.isEventHandler = isEventHandler;

    if (this.messageHandlers.has(normalizedPattern) && isEventHandler) {
      const headRef = this.messageHandlers.get(normalizedPattern);
      const getTail: any = (handler: MessageHandler) =>
        handler?.next ? getTail(handler.next) : handler;

      const tailRef = getTail(headRef);
      tailRef.next = callback;
    } else {
      this.messageHandlers.set(normalizedPattern, callback);
    }
  }

  public getHandlers(): Map<string, MessageHandler> {
    return this.messageHandlers;
  }

  public getHandlerByPattern(pattern: string): MessageHandler<any, any, any> | null | undefined {
    const route = this.getRouteFromPattern(pattern);
    return this.messageHandlers.has(route)
      ? this.messageHandlers.get(route)
      : null;
  }

  public send(
    stream$: Observable<any>,
    respond: (data: WritePacket) => unknown | Promise<unknown>,
  ): Subscription {
    let dataBuffer: WritePacket[] | null = null;
    const scheduleOnNextTick = (data: WritePacket) => {
      if (!dataBuffer) {
        dataBuffer = [data];
        process.nextTick(async () => {
          if (dataBuffer) {
            for (const item of dataBuffer) {
              await respond(item);
            }
          }
          dataBuffer = null;
        });
      } else if (!data.isDisposed) {
        dataBuffer = dataBuffer.concat(data);
      } else {
        dataBuffer[dataBuffer.length - 1].isDisposed = data.isDisposed;
      }
    };
    return stream$
      .pipe(
        catchError((err: any) => {
          scheduleOnNextTick({ err });
          return EMPTY;
        }),
        finalize(() => scheduleOnNextTick({ isDisposed: true })),
      )
      .subscribe((response: any) => scheduleOnNextTick({ response }));
  }

  public async handleEvent(
    pattern: string,
    packet: ReadPacket,
    context: BaseRpcContext,
  ): Promise<any> {
    const handler = this.getHandlerByPattern(pattern);
    if (!handler) {
      return this.logger.error(
        `${NO_EVENT_HANDLER} Event pattern: ${JSON.stringify(pattern)}.`,
      );
    }
    const resultOrStream = await handler(packet.data, context);
    if (isObservable(resultOrStream)) {
      const connectableSource = connectable(resultOrStream, {
        connector: () => new Subject(),
        resetOnDisconnect: false,
      });
      connectableSource.connect();
    }
  }

  public transformToObservable<T>(
    resultOrDeferred: Observable<T> | Promise<T>,
  ): Observable<T>;

  public transformToObservable<T>(
    resultOrDeferred: T,
  ): never extends Observable<ObservedValueOf<T>>
    ? Observable<T>
    : Observable<ObservedValueOf<T>>;

  public transformToObservable(resultOrDeferred: any) {
    if (resultOrDeferred instanceof Promise) {
      return fromPromise(resultOrDeferred);
    }

    if (isObservable(resultOrDeferred)) {
      return resultOrDeferred;
    }

    return of(resultOrDeferred);
  }

  public getOptionsProp<
    T extends MicroserviceOptions['options']
  >(obj: T, prop: keyof T, defaultValue?: T[keyof T]) {
    return (obj && (obj)[prop]) || defaultValue;
  }

  protected handleError(error: string) {
    this.logger.error(error);
  }

  protected loadPackage<T = any>(
    name: string,
    ctx: string,
    loader?: Function,
  ): T {
    return loadPackage(name, ctx, loader);
  }

  protected initializeSerializer(options: ClientOptions['options']) {
    this.serializer =
      (options &&
        (
          options as
          | RmqOptions['options']
        )?.serializer
      ) ||
      new IdentitySerializer();
  }

  protected initializeDeserializer(options: ClientOptions['options']) {
    this.deserializer =
      (options &&
        (
          options as
            | RmqOptions['options']
        )?.deserializer
      ) ||
      new IncomingRequestDeserializer();
  }

  /**
   * Transforms the server Pattern to valid type and returns a route for him.
   *
   * @param  {string} pattern - server pattern
   * @returns string
   */
  protected getRouteFromPattern(pattern: string): string {
    let validPattern: MsPattern;

    try {
      validPattern = JSON.parse(pattern);
    } catch (error) {
      // Uses a fundamental object (`pattern` variable without any conversion)
      validPattern = pattern;
    }
    return this.normalizePattern(validPattern);
  }

  protected normalizePattern(pattern: MsPattern): string {
    return transformPatternToRoute(pattern);
  }
}