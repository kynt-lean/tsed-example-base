import { RmqOptions } from "../../shared/microservices";
import { Transport } from "../../shared/microservices/enums";
import { rmqEnv } from "../env";

export const rmqConfig: RmqOptions = {
  transport: Transport.RMQ,
  options: {
    urls: rmqEnv.host ? [`amqp://${rmqEnv.user}:${rmqEnv.password}@${rmqEnv.host}`] : undefined,
    queue: rmqEnv.queue,
    noAck: true
  }
}