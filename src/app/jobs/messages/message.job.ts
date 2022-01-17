import { Rule, Schedule } from "../../../shared/schedules";

@Schedule()
export class MessageJob {
  @Rule('15 */1 * * * *')
  async publishMessageBus() {
    console.log('publishMessage');
  }
}