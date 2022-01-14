import { BodyParams, Controller, Delete, Get, PathParams, Post } from "@tsed/common";
import { RouteDecorator } from "../../../core/decorators";
import { ScheduleRule, ScheduleService } from "../../../shared/schedules";

@Controller('/schedule')
@RouteDecorator()
export class JobController {
  constructor(private service: ScheduleService) { }

  @Get('/jobs')
  getJobs() {
    return this.service.getJobs();
  }

  @Post('/rescheduleJob/:job')
  rescheduleJob(@PathParams('job') job: string, @BodyParams() spec: { rule: ScheduleRule }) {
    return this.service.rescheduleJob(job, spec.rule);
  }

  @Delete('/cancelJob/:job')
  cancelJob(@PathParams('job') job: string) {
    return this.service.cancelJob(job);
  }
}