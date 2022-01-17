import { Controller } from "@tsed/common";
import { EventPattern, MessagePattern } from "../../../shared/microservices";

@Controller("/subscribers")
export class SubscribersController {
  @MessagePattern({ cmd: 'sum' })
  accumulate(data: number[]): number {
    return (data || []).reduce((a, b) => a + b);
  }

  @EventPattern({ cmd: 'publish-something' })
  handleEvent(data: Record<string, unknown>) {
    console.log({ received: data });
    return { received: data };
  }
}