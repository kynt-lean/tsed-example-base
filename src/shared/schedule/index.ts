declare global {
  namespace TsED {
    interface Configuration {
      schedule?: {
        /**
         * Enable schedule jobs. Default false.
         */
        enabled?: boolean;
      };
    }
  }
}

export * from "./ScheduleModule";
export * from "./constants";
export * from "./decorators";
export * from "./interfaces/ScheduleStore";
export * from "./services/ScheduleService";
