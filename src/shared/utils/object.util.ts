import { Type } from "@tsed/core";
import { isObject } from "./shared.util";

export function mergeDefaultOptions<T>(defaultOptions: T, options?: T) {
  const keys = Object.keys(defaultOptions) as [keyof T];
  if (!options) {
    return defaultOptions;
  } else {
    for (const key of keys) {
      const defaultValue = defaultOptions[key];
      let value = options[key];
      if (isObject(defaultValue)) {
        value = mergeDefaultOptions(defaultValue, value);
      } else {
        value = value ?? defaultValue;
      }
      options[key] = value;
    }
    return options;
  }
}

export function getObjectProp<T = Type<any>>(obj: T, prop: keyof T, defaultValue?: T[keyof T]) {
  return (obj && (obj)[prop]) || defaultValue;
}