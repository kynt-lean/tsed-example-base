import { ClientRMQ } from "./client-rmq";
import { ClientOptions } from "../interfaces";
import { Transport } from "../enums";
import { ClientTCP } from "./client-tcp";

export class ClientProxyFactory {
  public static create(clientOptions: ClientOptions) {
    const { transport, options } = clientOptions;
    switch (transport) {
      case Transport.RMQ:
        return new ClientRMQ(options);

      default:
        return new ClientTCP(options);
    }
  }
}