import type { IConfigService } from "@application/config/IConfigService";
import type { Application } from "express";

export class Server {
  constructor(
    private readonly app: Application,
    private readonly configService: IConfigService
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
