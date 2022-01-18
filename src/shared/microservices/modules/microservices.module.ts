import { InjectorService } from "@tsed/common";
import { Exception } from "@tsed/exceptions";
import { RpcProxy } from "../context";
import { ListenersController } from "../controllers";
import { CustomTransportStrategy } from "../interfaces";
import { Server } from "../servers";

export class MicroservicesModule {
  private listenersController: ListenersController;

  public register(
    injector: InjectorService,
    server: Server & CustomTransportStrategy
  ) {
    const rpcProxy = new RpcProxy();    

    this.listenersController = new ListenersController(
      injector,
      rpcProxy,
      server
    );
  }

  public async setupListeners() {
    if (!this.listenersController) {
      throw new Exception();
    }
    await this.bindListeners();
  }

  public async bindListeners() {
    await this.listenersController.registerMessageHandlersForProviders();
  }
}