import type { LoggingLevel } from "@shared/application/IAppLogger";
import type DependencyContainer from "tsyringe/dist/typings/types/dependency-container";

import { SharedTokens } from "@shared/di/tokens";
import { ExpressLogger } from "@shared/infrastructure/ExpressLogger";
import { Logger } from "@shared/infrastructure/Logger";
import { getLoggerModeFromString } from "@shared/utils/get-logger-mode-from-string";

export class SharedDependencyRegistrar {
  constructor(private readonly container: DependencyContainer) {}

  public registerDependencies() {
    this.container.register(SharedTokens.RequestLogger, {
      useClass: ExpressLogger,
    });
    this.container.register<LoggingLevel>(SharedTokens.LoggerMode, {
      useValue: getLoggerModeFromString(process.env.LOGGING_MODE),
    });
    this.container.register(SharedTokens.AppLogger, {
      useClass: Logger,
    });
  }
}
