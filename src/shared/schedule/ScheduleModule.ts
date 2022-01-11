import { AfterListen, Logger, Constant, Inject, Module } from "@tsed/common";
import { ScheduleService } from "./services/ScheduleService";

@Module()
export class ScheduleModule implements AfterListen {
  @Inject()
  protected logger: Logger;

  @Inject()
  protected service: ScheduleService;

  @Constant("schedule.enabled", false)
  private loadSchedule: boolean;

  async $afterListen(): Promise<any> {
    if (this.loadSchedule) {
      this.logger.info("Schedule add jobs...");
      this.service.scheduleJobsForProviders();
    } else {
      this.logger.info("Schedule jobs disabled...");
    }
  }
}