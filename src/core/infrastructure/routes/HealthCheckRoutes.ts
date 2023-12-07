import type { IAppRouterV1 } from "@application/routes/IAppRouterV1";

import { Router } from "express";
import { injectable } from "tsyringe";

/**
 * @openapi
 * tags:
 *   name: Health Check
 *   description: Defines health check operations.
 */
@injectable()
export class HealthCheckRoutes implements IAppRouterV1 {
  public _apiVersion = 1000 as const;
  public router = Router();

  constructor() {
    this.register();
  }

  private register() {
    /**
     * @openapi
     * /health-check:
     *   get:
     *     summary: Health check endpoint.
     *     description: This endpoint is used to check if the service is up and running.
     *     tags:
     *       - Health Check
     *     responses:
     *       200:
     *         description: OK
     */
    this.router.get("/health-check", (req, res) => {
      res.send("OK");
    });
  }
}
