declare global {
  namespace TsED {
    interface Configuration {
      schedule?: {
        enabled?: boolean;
      };
    }
  }
}

export * from "./constants";
export * from "./decorators"
export * from "./interfaces";
export * from "./modules";
export * from "./services";