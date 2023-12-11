import type { IAppRouterV1 } from "@application/routes/IAppRouterV1";

import express, { Application } from "express";
import { inject, injectable, injectAll } from "tsyringe";

import { IConfigService } from "@application/config/IConfigService";
import { DI_TOKENS } from "@infrastructure/di/tokens";
import { IAppLogger } from "@shared/application/IAppLogger";
import { IRequestLogger } from "@shared/application/IRequestLogger";
import { SharedTokens } from "@shared/di/tokens";

@injectable()
export class Server {
  constructor(
    @inject(DI_TOKENS.Application) private app: Application,
    @inject(DI_TOKENS.ConfigService) private configService: IConfigService,
    @injectAll(DI_TOKENS.AppRouterV1) private appRouterV1s: IAppRouterV1[],
    @inject(SharedTokens.RequestLogger) private requestLogger: IRequestLogger,
    @inject(SharedTokens.AppLogger) private logger: IAppLogger
  ) {}

  async start() {
    const port = this.configService.get("PORT");
    const host = this.configService.get("HOST");

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(
      this.requestLogger.logRequest({
        logBody: true,
        logHeaders: false,
        logParams: true,
        logQuery: true,
      })
    );

    this.appRouterV1s.forEach((routerV1) => {
      this.app.use("/api/v1", routerV1.router);
    });

    this.logger.info("Logging level: " + this.logger.getLevel().toString());

    this.app.listen(port, () => {
      this.logger.info(`Server is listening on ${host}:${port}`);
    });
  }
}
