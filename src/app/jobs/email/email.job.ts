import { Rule, Schedule } from "../../../shared/schedules";

@Schedule()
export class EmailJob {
  @Rule('5 */1 * * * *')
  async sendWelcomeEmail() {
    console.log('sendWelcomeEmail');
  }
}