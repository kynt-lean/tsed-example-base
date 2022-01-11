import { Rule, Schedule } from "../../../shared/schedule";

@Schedule()
export class EmailJob {
  @Rule('0 */1 * * * *')
  async sendAdminStatistics() {
    console.log('sendAdminStatistics');
  }

  @Rule('5 */1 * * * *')
  async sendWelcomeEmail() {
    console.log('sendWelcomeEmail');
  }

  @Rule('10 */1 * * * *')
  async sendFollowUpEmail() {
    console.log('sendFollowUpEmail');
  }
}