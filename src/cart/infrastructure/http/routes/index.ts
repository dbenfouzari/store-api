import type { IAppRouterV1 } from "@application/routes/IAppRouterV1";

import { Router } from "express";
import { inject, injectable } from "tsyringe";

import { CART_TOKENS } from "@cart/di/tokens";

import { AddItemToCartRoute } from "./AddItemToCartRoute";

/**
 * @openapi
 * tags:
 *   name: Cart
 *   description: |
 *     `Cart` operations.
 *
 *     The `Cart` is linked to the `User`, so we should be able to get it even if the param is not given.
 *     If the `Cart` does not exist yet, we create it, so it's invisible front-end side.
 *
 *     In theory, emptying a `Cart` would mean deleting it, since it must be re-created if
 *     it does not exist.
 */
@injectable()
export class CartRoutes implements IAppRouterV1 {
  public _apiVersion = 1000 as const;
  public router = Router();

  constructor(
    @inject(CART_TOKENS.AddItemToCartRoute) private addItemToCartRoute: AddItemToCartRoute
  ) {
    this.register();
  }

  private register() {
    this.router.use(this.addItemToCartRoute.register());
  }
}
