import { InjectorService, Logger } from "@tsed/common";
import { CustomTransportStrategy, MicroserviceOptions } from "./interfaces";
import { MicroservicesModule } from "./modules";
import { Server, ServerFactory } from "./servers";

export class Microservice {
  protected readonly microservicesModule = new MicroservicesModule();
  protected server: Server & CustomTransportStrategy;

  constructor(
    protected readonly logger: Logger,
    injector: InjectorService,
    config: MicroserviceOptions
  ) {
    this.createServer(config);
    if (this.server) {
      this.microservicesModule.register(injector, this.server);
      this.microservicesModule.setupListeners();
    }
  }

  public createServer(config: MicroserviceOptions) {
    try {
      this.server = ServerFactory.create(this.logger, config);
    }
    catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async listen() {
    if (this.server) {
      return new Promise<any>((resolve, reject) => {
        this.server.listen((err, info) => {
          if (err) {
            return reject(err);
          }
          this.logger.info("Microservice success started");
          resolve(info);
        });
      });
    }
  }
}