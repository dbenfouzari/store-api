import type { IAppRouterV1 } from "@application/routes/IAppRouterV1";

import { Application } from "express";
import { inject, injectable, injectAll } from "tsyringe";

import { IConfigService } from "@application/config/IConfigService";
import { DI_TOKENS } from "@infrastructure/di/tokens";

@injectable()
export class Server {
  constructor(
    @inject(DI_TOKENS.Application) private app: Application,
    @inject(DI_TOKENS.ConfigService) private configService: IConfigService,
    @injectAll(DI_TOKENS.AppRouterV1) private appRouterV1s: IAppRouterV1[]
  ) {}

  async start() {
    const port = this.configService.get("PORT");
    const host = this.configService.get("HOST");

    this.appRouterV1s.forEach((routerV1) => {
      this.app.use("/api/v1", routerV1.router);
    });

    this.app.listen(port, () => {
      console.log(`Server is listening on ${host}:${port}`);
    });
  }
}
