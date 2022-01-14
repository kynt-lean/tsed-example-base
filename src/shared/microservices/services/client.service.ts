import { AfterInit, Constant, Inject, Injectable, InjectorService, Logger } from "@tsed/common";
import { ClientProxy, ClientProxyFactory } from "../client";
import { ClientOptions } from "../interfaces";

@Injectable()
export class ClientService implements AfterInit {
  @Inject()
  protected logger: Logger;

  @Inject()
  protected injector: InjectorService;

  @Constant('microservice')
  protected config: ClientOptions

  public client: ClientProxy;

  $afterInit(): void | Promise<any> {
    this.initClient();
  }

  protected initClient() {
    this.createClient(this.config);
    this.connectServer();
  }  

  protected createClient(config: ClientOptions) {
    this.client = ClientProxyFactory.create(config);
  }

  protected connectServer() {
    this.client.connect();
  }
}