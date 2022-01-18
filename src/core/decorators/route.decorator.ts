import { Type, useDecorators } from "@tsed/core";
import { AnyDecorator } from "@tsed/core/lib/types/interfaces/AnyDecorator";
import { Authenticate, AuthenticateOptions } from "@tsed/passport";
import { Returns, Security } from "@tsed/schema";
import { isFalse, isObject } from "../../shared/utils";

const defaultOptions: RouteDecoratorOptions = {
  authenticate: {
    protocol: "jwt"
  },
  security: {
    name: "bearer"
  },
  defaultOptions: true
}

export interface RouteSuccessOptions {
  statusCode?: string | number,
  model?: Type<any> | Type<any>[],
  description?: string;
}

export interface RouteDecoratorOptions {
  authenticate?: RouteAuthenticateOptions;
  security?: RouteSecurityOptions;
  successOptions?: RouteSuccessOptions;
  defaultOptions?: boolean;
}

export interface RouteAuthenticateOptions {
  protocol?: string | string[];
  options?: AuthenticateOptions;
}

export interface RouteSecurityOptions {
  name: string;
  scopes?: string[];
}

export function RouteDecorator(options?: RouteDecoratorOptions): Function {
  if (!isFalse(options?.defaultOptions)) {
    mergeDefaultOptions(defaultOptions, options);
  }

  let decorators: AnyDecorator[];
  decorators = [
    Returns(400).Description("Validation error"),
    Returns(401).Description("Unauthorized"),
    Returns(403).Description("Forbidden"),
    Returns(404).Description("Not Found"),
    Returns(500).Description("Server error"),
    Returns(501).Description("Server error")
  ];
  if (options?.successOptions) {
    const { statusCode, model, description } = options.successOptions;
    decorators.push(Returns(statusCode || 200, model).Description(description || "Success"));
  }
  if (options?.authenticate) {
    decorators.push(Authenticate(options?.authenticate.protocol, options?.authenticate.options || { session: true }));
  }
  if (options?.security) {
    decorators.push(Security(options?.security.name, ...(options?.security.scopes || [])));
  }
  return useDecorators(
    ...decorators
  );
}

export function mergeDefaultOptions<T>(defaultOptions: T, options?: T) {
  const keys = Object.keys(defaultOptions) as [keyof T];
  if (!options) {
    return defaultOptions;
  } else {
    for (const key of keys) {
      const defaultValue = defaultOptions[key];
      let value = options[key];
      if (isObject(value)) {
        value = mergeDefaultOptions(defaultValue, value);
      } else {
        value = value ?? defaultValue;
      }
    }
    return options;
  }
}