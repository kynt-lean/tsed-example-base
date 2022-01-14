import { Transport } from "../enums";
import { RmqUrl } from "../external";
import { Deserializer } from "./deserializer.interface";
import { Serializer } from "./serializer.interface";

export type MicroserviceOptions =
  | TcpOptions
  | RmqOptions;

export interface TcpOptions {
  transport?: Transport.TCP;
  options?: {
    host?: string;
    port?: number;
    retryAttempts?: number;
    retryDelay?: number;
    serializer?: Serializer;
    deserializer?: Deserializer;
  };
}

export interface RmqOptions {
  transport?: Transport.RMQ;
  options?: {
    urls?: string[] | RmqUrl[];
    queue?: string;
    prefetchCount?: number;
    isGlobalPrefetchCount?: boolean;
    queueOptions?: any; // AmqplibQueueOptions;
    socketOptions?: any; // AmqpConnectionManagerSocketOptions;
    noAck?: boolean;
    serializer?: Serializer;
    deserializer?: Deserializer;
    replyQueue?: string;
    persistent?: boolean;
    headers?: Record<string, string>;
  };
}