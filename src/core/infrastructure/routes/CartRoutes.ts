import type { IAppRouterV1 } from "@application/routes/IAppRouterV1";

import { Router } from "express";
import { injectable } from "tsyringe";

@injectable()
export class CartRoutes implements IAppRouterV1 {
  public _apiVersion = 1000 as const;
  private basePath = "/cart";
  public router = Router();

  constructor() {
    this.register();
  }

  private register() {
    this.router.get(this.basePath, (req, res) => {
      res.send("OK from cart");
    });

    this.router.get(`${this.basePath}/:id`, (req, res) => {
      res.send(`OK from cart with id ${req.params.id}`);
    });
  }
}
