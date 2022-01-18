import { MicroserviceOptions } from './interfaces';

declare global {
  namespace TsED {
    interface Configuration {
      microservice?: MicroserviceOptions;
    }
  }
}

export * from "./modules";
export * from "./controllers";
export * from "./decorators";
export * from "./interfaces";
export * from "./ctx-host";
export * from "./deserializers";
export * from "./enums";
export * from "./errors";
export * from "./exceptions";
export * from "./external";
export * from "./helpers";
export * from "./record-builders";
export * from "./serializers";
export * from "./servers";
export * from "./utils";
export * from "./client";
export * from "./constants";
export * from "./context";
export * from "./microservice";