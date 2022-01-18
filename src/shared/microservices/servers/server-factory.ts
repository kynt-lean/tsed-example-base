import { Logger } from "@tsed/common";
import { Transport } from "../enums";
import { CustomTransportStrategy, MicroserviceOptions } from "../interfaces";
import { Server } from "./server";
import { ServerRMQ } from "./server-rmq";
import { ServerTCP } from "./server-tcp";

export class ServerFactory {
  public static create(
    logger: Logger,
    microserviceOptions: MicroserviceOptions,
  ): Server & CustomTransportStrategy {
    const { transport, options } = microserviceOptions as any;
    switch (transport) {
      case Transport.RMQ:
        return new ServerRMQ(logger, options);
      default:
        return new ServerTCP(logger, options);
    }
  }
}