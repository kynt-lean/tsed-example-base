import { MicroserviceOptions } from './interfaces';

declare global {
  namespace TsED {
    interface Configuration {
      microservice?: MicroserviceOptions;
    }
  }
}

export * from "./modules";
export * from "./services";
export * from "./decorators";
export * from "./interfaces";