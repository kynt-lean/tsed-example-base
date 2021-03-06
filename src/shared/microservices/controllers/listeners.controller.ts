import { InjectorService, Provider, ProviderType } from "@tsed/common";
import { connectable, Observable, Subject } from "rxjs";
import { RpcProxy } from "../context";
import { PatternType } from "../enums";
import { CustomTransportStrategy, MessageHandler, MicroserviceStore } from "../interfaces";
import { Server } from "../servers";

export class ListenersController {
  constructor(
    private readonly injector: InjectorService,
    private readonly rpcProxy: RpcProxy,
    private readonly server: Server & CustomTransportStrategy,
  ) { }

  public async registerMessageHandlersForProviders(): Promise<any> {
    const providers = this.getProviders();
    await Promise.all(
      providers.map((provider) => this.registerMessageHandlersForProvider(provider))
    );
  }

  protected async registerMessageHandlersForProvider(provider: Provider): Promise<any> {
    const store = provider.store.get<MicroserviceStore>("microservice");
    const msClass = provider.name;

    if (!store || !store[msClass]) {
      return;
    }

    const msToRegister = Object.entries(store[msClass]);
    const instance = this.injector.get(provider.token);

    await Promise.all(
      msToRegister.map(([msMethod, { type, pattern }]) => {
        const callback = instance[msMethod].bind(instance);
        const proxy = this.rpcProxy.create(callback);

        if (type === PatternType.EVENT) {
          const isEventHandler = true;
          const eventHandler: MessageHandler = (...args: unknown[]) => {
            const originalArgs = args;
            const originalReturnValue = proxy(...args);
            const returnedValueWrapper = eventHandler.next?.(
              ...(originalArgs as Parameters<MessageHandler>),
            );
            returnedValueWrapper?.then(returnedValue =>
              this.connectIfStream(returnedValue as Observable<unknown>),
            );
            return originalReturnValue;
          };

          this.server.addHandler(pattern, eventHandler, isEventHandler);
        } else {
          this.server.addHandler(pattern, proxy);
        }
      })
    );
  }

  protected getProviders(): Provider<any>[] {
    return Array.from(this.injector.getProviders(ProviderType.CONTROLLER));
  }

  protected connectIfStream(source: Observable<unknown>) {
    if (!source) {
      return;
    }
    const connectableSource = connectable(source, {
      connector: () => new Subject(),
      resetOnDisconnect: false,
    });
    connectableSource.connect();
  }
}