import { JwtConfigOptions } from "./interfaces/JwtOptions";

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

export * from "./interfaces/JwtOptions";
export * from "./services/JwtService";