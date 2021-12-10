import { useDecorators } from "@tsed/core";
import { Authenticate, AuthenticateOptions } from "@tsed/passport";
import { Returns, Security } from "@tsed/schema";

export interface CrudDecoratorOptions {
  protocol?: string | string[],
  options?: AuthenticateOptions
}

export function CrudDecorators(options?: CrudDecoratorOptions): Function {
  return useDecorators(
    Authenticate(options?.protocol || "jwt"),
    Security("jwt-bearer", "token"),
    Returns(400).Description("Validation error"),
    Returns(401).Description("Unauthorized"),
    Returns(403).Description("Forbidden"),
    Returns(404).Description("Not Found")
  );
}