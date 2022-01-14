import { Inject, Injectable, InjectorService, Provider } from "@tsed/common";
import { cancelJob, JobCallback, rescheduleJob, scheduleJob } from "node-schedule";
import { PROVIDER_TYPE_SCHEDULE } from "../constants";
import { ScheduleRule, ScheduleStore } from "../interfaces";

@Injectable()
export class ScheduleService {
  @Inject()
  protected injector: InjectorService;

  public getJobs(): ScheduleStore[] {
    return this.getStores();
  }

  public scheduleJob(rule: ScheduleRule, callback: JobCallback): string {
    const job = scheduleJob(rule, callback);
    return job.name;
  }

  public rescheduleJob(job: string, rule: ScheduleRule): boolean {
    const rescheduleStores = this.rescheduleStores(job, rule);
    if (rescheduleStores) {
      rescheduleJob(job, rule);
    }
    return rescheduleStores;
  }

  public cancelJob(job: string): boolean {
    const deleteStores = this.deleteStores(job);
    if (deleteStores) {
      cancelJob(job);
    }
    return deleteStores;
  }

  public scheduleJobsForProviders(): void {
    const providers = this.getProviders();
    providers.forEach((provider) => this.scheduleJobsForProvider(provider));
  }

  protected getProviders(): Provider<any>[] {
    return Array.from(this.injector.getProviders(PROVIDER_TYPE_SCHEDULE));
  }

  protected getStores(): ScheduleStore[] {
    const providers = this.getProviders();
    return providers.map((provider) => provider.store.get<ScheduleStore>("schedule"));
  }

  protected scheduleJobsForProvider(provider: Provider): void {
    const store = provider.store.get<ScheduleStore>("schedule");
    const jobClass = provider.name;
    if (!store[jobClass]) {
      return;
    }

    const jobsToSchedule = Object.entries(store[jobClass]);
    const instance = this.injector.get(provider.token);

    for (const [jobMethod, { rule }] of jobsToSchedule) {
      const callback: JobCallback = instance[jobMethod].bind(instance) as JobCallback;

      const jobName = this.scheduleJob(rule, callback);

      store[jobClass][jobMethod].jobName = jobName;
      provider.store.set("schedule", store);
    }
  }

  protected rescheduleStores(job: string, rule: ScheduleRule): boolean {
    let rescheduleStores = false;
    const providers = this.getProviders();
    for (const provider of providers) {
      const deleteStore = this.rescheduleStore(provider, job, rule);
      if (deleteStore) {
        rescheduleStores = true;
        break;
      }
    }
    return rescheduleStores;
  }

  protected rescheduleStore(provider: Provider, job: string, rule: ScheduleRule): boolean {
    const store = provider.store.get<ScheduleStore>("schedule");
    const { find, findJobClass, findJobMethod } = this.getJob(store, job);

    if (find && findJobClass && findJobMethod) {
      store[findJobClass][findJobMethod].rule = rule;
      provider.store.set("schedule", store);
      return true;
    }

    return false;
  }

  protected deleteStores(job: string): boolean {
    let deleteStores = false;
    const providers = this.getProviders();
    for (const provider of providers) {
      const deleteStore = this.deleteStore(provider, job);
      if (deleteStore) {
        deleteStores = true;
        break;
      }
    }
    return deleteStores;
  }

  protected deleteStore(provider: Provider, job: string): boolean {
    const store = provider.store.get<ScheduleStore>("schedule");
    const { find, findJobClass, findJobMethod } = this.getJob(store, job);

    if (find && findJobClass && findJobMethod) {
      delete store[findJobClass][findJobMethod];
      provider.store.set("schedule", store);
      return true;
    }

    return false;
  }

  protected getJob(store: ScheduleStore, job: string) {
    let find = false,
      findJobClass: string | null = null,
      findJobMethod: string | null = null;

    const jobClasses = Object.keys(store);

    for (const jobClass of jobClasses) {
      const jobMethods = Object.keys(store[jobClass]);

      for (const jobMethod of jobMethods) {
        if (store[jobClass][jobMethod].jobName === job) {
          findJobClass = jobClass;
          findJobMethod = jobMethod;
          find = true;
          break;
        }
      }

      if (find) {
        break;
      }
    }

    return { find, findJobClass, findJobMethod };
  }
}