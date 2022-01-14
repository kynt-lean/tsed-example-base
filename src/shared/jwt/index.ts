import { JwtConfigOptions } from "./interfaces/jwt-options.interface";

declare global {
  namespace TsED {
    interface Configuration {
      /**
       * Jwt config options.
       */
      jwt?: JwtConfigOptions;
    }
  }
}

export * from "./interfaces/jwt-options.interface";
export * from "./services/jwt.service";