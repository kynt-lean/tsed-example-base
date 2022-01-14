import { isNil, randomStringGenerator } from "../../utils";
import { connectable, defer, fromEvent, map, merge, mergeMap, Observable, Observer, Subject, take, throwError as _throw } from "rxjs";
import { ClientOptions, MsPattern, PacketId, ProducerDeserializer, ProducerSerializer, ReadPacket, RmqOptions, WritePacket } from "../interfaces";
import { InvalidMessageException } from "../errors";
import { CONNECT_EVENT, ERROR_EVENT } from "../constants";
import { transformPatternToRoute } from "../utils";
import { IdentitySerializer } from "../serializers";
import { IncomingResponseDeserializer } from "../deserializers";

export abstract class ClientProxy {
  public abstract connect(): Promise<any>;
  public abstract close(): any;

  protected routingMap = new Map<string, Function>();
  protected serializer: ProducerSerializer;
  protected deserializer: ProducerDeserializer;

  public send<TResult = any, TInput = any>(
    pattern: any,
    data: TInput
  ): Observable<TResult> {
    if (isNil(pattern) || isNil(data)) {
      return _throw(() => new InvalidMessageException);
    }
    return defer(async () => this.connect()).pipe(
      mergeMap(
        () =>
          new Observable((observer: Observer<TResult>) => {
            const callback = this.createObserver(observer);
            return this.publish({ pattern, data }, callback);
          })
      )
    );
  }

  public emit<TResult = any, TInput = any>(
    pattern: any,
    data: TInput,
  ): Observable<TResult> {
    if (isNil(pattern) || isNil(data)) {
      return _throw(() => new InvalidMessageException);
    }
    const source = defer(async () => this.connect()).pipe(
      mergeMap(() => this.dispatchEvent({ pattern, data })),
    );
    const connectableSource = connectable(source, {
      connector: () => new Subject(),
      resetOnDisconnect: false,
    });
    connectableSource.connect();
    return connectableSource;
  }

  protected abstract publish(
    packet: ReadPacket,
    callback: (packet: WritePacket) => void,
  ): () => void;

  protected abstract dispatchEvent<T = any>(packet: ReadPacket): Promise<T>;

  protected createObserver<T>(
    observer: Observer<T>,
  ): (packet: WritePacket) => void {
    return ({ err, response, isDisposed }: WritePacket) => {
      if (err) {
        return observer.error(this.serializeError(err));
      } else if (response !== undefined && isDisposed) {
        observer.next(this.serializeResponse(response));
        return observer.complete();
      } else if (isDisposed) {
        return observer.complete();
      }
      observer.next(this.serializeResponse(response));
    };
  }

  protected serializeError(err: any): any {
    return err;
  }

  protected serializeResponse(response: any): any {
    return response;
  }

  protected assignPacketId(packet: ReadPacket): ReadPacket & PacketId {
    const id = randomStringGenerator();
    return Object.assign(packet, { id });
  }

  protected connect$(
    instance: any,
    errorEvent = ERROR_EVENT,
    connectEvent = CONNECT_EVENT,
  ): Observable<any> {
    const error$ = fromEvent(instance, errorEvent).pipe(
      map((err: any) => {
        throw err;
      }),
    );
    const connect$ = fromEvent(instance, connectEvent);
    return merge(error$, connect$).pipe(take(1));
  }

  protected getOptionsProp<
    T extends ClientOptions['options']
  >(obj: T, prop: keyof T, defaultValue?: T[keyof T]) {
    return (obj && (obj)[prop]) || defaultValue;
  }

  protected normalizePattern(pattern: MsPattern): string {
    return transformPatternToRoute(pattern);
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
      new IncomingResponseDeserializer();
  }
}