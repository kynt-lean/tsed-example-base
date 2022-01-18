import * as net from 'net';
import { EmptyError, lastValueFrom, share, tap } from "rxjs";
import { CLOSE_EVENT, ECONNREFUSED, ERROR_EVENT, MESSAGE_EVENT, TCP_DEFAULT_HOST, TCP_DEFAULT_PORT } from "../constants";
import { JsonSocket } from "../helpers";
import { PacketId, ReadPacket, TcpClientOptions, WritePacket } from "../interfaces";
import { ClientProxy } from "./client-proxy";

export class ClientTCP extends ClientProxy {
  protected connection: Promise<any>;

  private readonly port: number;
  private readonly host: string;
  private isConnected = false;
  private socket: JsonSocket;

  constructor(options: TcpClientOptions['options']) {
    super();
    this.port = TCP_DEFAULT_PORT;
    this.host = TCP_DEFAULT_HOST;
    if (options) {
      this.port = parseInt(this.getOptionsProp(options, 'port')?.toString() || TCP_DEFAULT_PORT.toString());
      this.host = this.getOptionsProp(options, 'host')?.toString() || TCP_DEFAULT_HOST;
    }
    this.initializeSerializer(options);
    this.initializeDeserializer(options);
  }

  public connect(): Promise<any> {
    if (this.isConnected && this.connection) {
      return this.connection;
    }
    this.socket = this.createSocket();
    this.bindEvents(this.socket);

    const source$ = this.connect$(this.socket.netSocket).pipe(
      tap(() => {
        this.isConnected = true;
        this.socket.on(MESSAGE_EVENT, (buffer: WritePacket & PacketId) =>
          this.handleResponse(buffer),
        );
      }),
      share(),
    );

    this.socket.connect(this.port, this.host);
    this.connection = lastValueFrom(source$).catch(err => {
      if (err instanceof EmptyError) {
        return;
      }
      throw err;
    });

    return this.connection;
  }

  public close() {
    this.socket && this.socket.end();
    this.handleClose();
  }

  public async handleResponse(buffer: unknown): Promise<void> {
    const { err, response, isDisposed, id } =
      await this.deserializer.deserialize(buffer);
    const callback = this.routingMap.get(id);
    if (!callback) {
      return undefined;
    }
    if (isDisposed || err) {
      return callback({
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

  public createSocket(): JsonSocket {
    return new JsonSocket(new net.Socket());
  }

  public bindEvents(socket: JsonSocket) {
    socket.on(
      ERROR_EVENT,
      (err: any) => err.code !== ECONNREFUSED && this.handleError(err),
    );
    socket.on(CLOSE_EVENT, () => this.handleClose());
  }

  public handleError(err: any) {
    this.logger.error(err);
  }

  public handleClose() {
    this.isConnected = false;
    this.socket.end();
  }

  protected publish(
    partialPacket: ReadPacket,
    callback: (packet: WritePacket) => any,
  ): () => void {
    const packet = this.assignPacketId(partialPacket);
    const serializedPacket = this.serializer.serialize(packet);

    this.routingMap.set(packet.id, callback);
    this.socket.sendMessage(serializedPacket);

    return () => this.routingMap.delete(packet.id);
  }

  protected async dispatchEvent(packet: ReadPacket): Promise<any> {
    const pattern = this.normalizePattern(packet.pattern);
    const serializedPacket = this.serializer.serialize({
      ...packet,
      pattern,
    });
    return this.socket.sendMessage(serializedPacket);
  }
}