import { RecurrenceRule, RecurrenceSpecDateRange, RecurrenceSpecObjLit } from "node-schedule";

export type ScheduleRule = RecurrenceRule | RecurrenceSpecDateRange | RecurrenceSpecObjLit | Date | string;

export interface DefineOptions {
  rule: ScheduleRule;
  jobName?: string;
}

export interface ScheduleStore {
  [jobClass: string]: {[jobMethod: string]: DefineOptions}
}