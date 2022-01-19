import { Type, useDecorators } from "@tsed/core";
import { AnyDecorator } from "@tsed/core/lib/types/interfaces/AnyDecorator";
import { Authenticate, AuthenticateOptions } from "@tsed/passport";
import { Returns, Security } from "@tsed/schema";
import { isFalse, mergeDefaultOptions } from "../../shared/utils";

const defaultOptions: RouteDecoratorOptions = {
  authenticate: {
    protocol: "jwt-local",
    options: {
      session: true
    }
  },
  security: {
    name: "bearer",
    scopes: [],
    noSecurity: false
  },
  success: {
    statusCode: 200,
    description: "Success"
  },
  default: true
}

export interface RouteSuccessOptions {
  statusCode?: string | number,
  model?: Type<any> | Type<any>[],
  description?: string;
  groups?: string | string[];
}

export interface RouteAuthenticateOptions {
  protocol?: string | string[];
  options?: AuthenticateOptions;
}

export interface RouteSecurityOptions {
  name?: string;
  scopes?: string | string[];
  noSecurity?: boolean;
}

export interface RouteDecoratorOptions {
  authenticate?: RouteAuthenticateOptions;
  security?: RouteSecurityOptions;
  success?: RouteSuccessOptions;
  default?: boolean;
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

  const { statusCode, model, description, groups } = options?.success || {};
  if (groups) {
    const groupsArr = Array.isArray(groups) ? groups : [groups];
    decorators.push(Returns(statusCode || 200, model).Description(description || "Success").Groups(...groupsArr));
  } else {
    decorators.push(Returns(statusCode || 200, model).Description(description || "Success"));
  }

  if (options?.authenticate) {
    const { protocol, options: authOptions } = options.authenticate;
    decorators.push(Authenticate(protocol, authOptions));
  }
  if (options?.security?.name && options?.security?.scopes && !options?.security?.noSecurity) {
    const { name, scopes } = options.security;
    const scopesArr = Array.isArray(scopes) ? scopes : [scopes];
    decorators.push(Security(name, ...scopesArr));
  }

  return useDecorators(
    ...decorators
  );
}