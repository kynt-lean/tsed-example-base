import { Store, useDecorators } from "@tsed/core";
import { ScheduleRule, ScheduleStore } from "../interfaces/ScheduleStore";

export function Rule(rule: ScheduleRule): MethodDecorator {
  return useDecorators(
    (target: any, propertyKey: string) => {
      const className = target.constructor.name;
      const store: ScheduleStore = {
        [className]: {
          [propertyKey]: { rule }
        }
      };
      Store.from(target).merge("schedule", store);
    }
  );
}