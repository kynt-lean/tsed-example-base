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
    name: "bearer",
    noSecurity: false
  },
  default: true
}

export interface RouteSuccessOptions {
  statusCode?: string | number,
  model?: Type<any> | Type<any>[],
  description?: string;
}

export interface RouteDecoratorOptions {
  authenticate?: RouteAuthenticateOptions;
  security?: RouteSecurityOptions;
  success?: RouteSuccessOptions;
  default?: boolean;
}

export interface RouteAuthenticateOptions {
  protocol?: string | string[];
  authOptions?: AuthenticateOptions;
}

export interface RouteSecurityOptions {
  name?: string;
  scopes?: string[];
  noSecurity?: boolean;
}

export function RouteDecorator(options?: RouteDecoratorOptions): Function {
  if (!isFalse(options?.default)) {
    options = mergeDefaultOptions(defaultOptions, options);
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

  const { statusCode, model, description } = options?.success || { statusCode: 200, model: undefined, description: undefined };
  decorators.push(Returns(statusCode, model).Description(description || "Success"));

  if (options?.authenticate) {
    const { protocol, authOptions } = options.authenticate;
    decorators.push(Authenticate(protocol, authOptions || { session: true }));
  }
  if (options?.security?.name && !options.security.noSecurity) {
    const { name, scopes } = options.security;
    decorators.push(Security(name, ...(scopes || [])));
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