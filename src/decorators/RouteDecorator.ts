import { useDecorators } from "@tsed/core";
import { Authenticate, AuthenticateOptions } from "@tsed/passport";
import { Returns, Security } from "@tsed/schema";

export interface RouteDecoratorOptions {
  protocol?: string | string[],
  options?: AuthenticateOptions
}

export function RouteDecorator(options?: RouteDecoratorOptions): Function {
  return useDecorators(
    Authenticate(options?.protocol || "jwt"),
    Security("jwt-bearer", "token"),
    Returns(400).Description("Validation error"),
    Returns(401).Description("Unauthorized"),
    Returns(403).Description("Forbidden"),
    Returns(404).Description("Not Found"),
    Returns(500).Description("Server error"),
    Returns(501).Description("Server error")
  );
}