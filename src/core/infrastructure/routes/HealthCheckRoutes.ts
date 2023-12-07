import type { IAppRouterV1 } from "@application/routes/IAppRouterV1";

import { Router } from "express";
import { injectable } from "tsyringe";

@injectable()
export class HealthCheckRoutes implements IAppRouterV1 {
  public _apiVersion = 1000 as const;
  public router = Router();

  constructor() {
    this.register();
  }

  private register() {
    this.router.get("/health-check", (req, res) => {
      res.send("OK");
    });
  }
}
