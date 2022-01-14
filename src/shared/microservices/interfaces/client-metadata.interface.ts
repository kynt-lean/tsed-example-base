import { Type } from "@tsed/core";
import { ClientProxy } from "../client";
import { Transport } from "../enums";
import { Deserializer } from "./deserializer.interface";
import { RmqOptions } from "./microservice-configuration.interface";
import { Serializer } from "./serializer.interface";

export type ClientOptions =
  | TcpClientOptions
  | RmqOptions;

export interface CustomClientOptions {
  customClass: Type<ClientProxy>;
  options?: Record<string, any>;
}

export interface TcpClientOptions {
  transport: Transport.TCP;
  options?: {
    host?: string;
    port?: number;
    serializer?: Serializer;
    deserializer?: Deserializer;
  };
}