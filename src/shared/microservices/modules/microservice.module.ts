import { AfterListen, Constant, Inject, Logger, Module } from "@tsed/common";
import { MicroserviceOptions } from "../interfaces";
import { ServerService } from "../services";

@Module()
export class MicroserviceModule implements AfterListen {
  @Inject()
  private logger: Logger;

  @Inject()
  public service: ServerService;

  @Constant('microservice')
  protected config: MicroserviceOptions;

  public async $afterListen(): Promise<any> {
    if (this.config) {
      await this.service.initServer(this.config);
      this.logger.info("Microservice success started");
    }
  }
}