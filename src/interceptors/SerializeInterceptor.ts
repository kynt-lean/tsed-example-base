import { Interceptor, InterceptorContext, InterceptorMethods, InterceptorNext } from "@tsed/common";
import { plainToInstance } from "class-transformer";

@Interceptor()
export class SerializeInterceptor implements InterceptorMethods {
  /**
   * ctx: The context that holds the dynamic data related to the method execution and the proceed method
   * to proceed with the original method execution
   *
   * opts: Static params that can be provided when the interceptor is attached to a specific method
   */
  async intercept(context: InterceptorContext<any>, next: InterceptorNext) {
    /**context.propertyKey: the method will be executed
      * context.args: args of the method will be execured
      * context.options: static params provided when the interceptor is attached
      */
    // let the original method by calling next function
    const result = await next();

    // must return the returned value back to the caller
    return plainToInstance(context.options, result);
  }
}