import { Transport } from "../enums";
import { CustomTransportStrategy, MicroserviceOptions } from "../interfaces";
import { Server } from "./server";
import { ServerRMQ } from "./server-rmq";
import { ServerTCP } from "./server-tcp";

export class ServerFactory {
  public static create(
    microserviceOptions: MicroserviceOptions,
  ): Server & CustomTransportStrategy {
    const { transport, options } = microserviceOptions as any;
    switch (transport) {
      case Transport.RMQ:
        return new ServerRMQ(options);
      default:
        return new ServerTCP(options);
    }
  }
}