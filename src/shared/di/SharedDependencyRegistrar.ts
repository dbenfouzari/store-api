import type DependencyContainer from "tsyringe/dist/typings/types/dependency-container";

import { SharedTokens } from "@shared/di/tokens";
import { ExpressLogger } from "@shared/infrastructure/ExpressLogger";

export class SharedDependencyRegistrar {
  constructor(private readonly container: DependencyContainer) {}

  public registerDependencies() {
    this.container.register(SharedTokens.RequestLogger, {
      useClass: ExpressLogger,
    });
  }
}
