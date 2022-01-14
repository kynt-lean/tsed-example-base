import { Store, useDecorators } from "@tsed/core";
import { PatternType, Transport } from "../enums";
import { MsStore, PatternMetadata } from "../interfaces";

export function MessagePattern<T = PatternMetadata | string>(
  metadata?: T,
  transport?: Transport
): MethodDecorator {
  return useDecorators(
    (target: any, propertyKey: string) => {
      const className = target.constructor.name;
      const store: MsStore = {
        [className]: {
          [propertyKey]: {
            type: PatternType.MESSAGE,
            pattern: metadata,
            transport: transport
          }
        }
      };
      Store.from(target).merge("microservice", store);
    }
  );
}