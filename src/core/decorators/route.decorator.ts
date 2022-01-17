import { useDecorators } from "@tsed/core";
import { AnyDecorator } from "@tsed/core/lib/types/interfaces/AnyDecorator";
import { Authenticate, AuthenticateOptions } from "@tsed/passport";
import { Returns, Security } from "@tsed/schema";

const defaultOptions: RouteDecoratorOptions = {
  authenticate: {
    protocol: "jwt"
  },
  security: {
    name: "bearer"
  },
  defaultOptions: true
}

export interface RouteDecoratorOptions {
  authenticate?: RouteAuthenticateOptions;
  security?: RouteSecurityOptions;
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
  if (!options) {
    options = defaultOptions;
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