import { Application } from "express";
import { inject, injectable } from "tsyringe";

import { IConfigService } from "@application/config/IConfigService";
import { DI_TOKENS } from "@infrastructure/di/tokens";

@injectable()
export class Server {
  constructor(
    @inject(DI_TOKENS.Application) private app: Application,
    @inject(DI_TOKENS.ConfigService) private configService: IConfigService
  ) {}

  async start() {
    const port = this.configService.get("PORT");
    const host = this.configService.get("HOST");

    this.app.get("/", (req, res) => {
      res.send("Hello World!");
    });

    this.app.listen(port, () => {
      console.log(`Server is listening on ${host}:${port}`);
    });
  }
}
