import type { IAppRouterV1 } from "@application/routes/IAppRouterV1";

import { Router } from "express";
import { inject, injectable } from "tsyringe";

import { ProductRoutesTokens } from "@product/di/tokens";
import { CreateProductRoute } from "@product/infrastructure/http/routes/CreateProductRoute";

/**
 * @openapi
 * tags:
 *   - name: Product
 *     description: |
 *       `Product` operations.
 *
 *       Only an admin can create, update or delete a product.
 *       A user can only view products.
 */
@injectable()
export class ProductRoutes implements IAppRouterV1 {
  _apiVersion = 1000 as const;
  router = Router();

  constructor(
    @inject(ProductRoutesTokens.CreateProductRoute)
    private createProductRoute: CreateProductRoute
  ) {
    this.register();
  }

  private register() {
    this.router.use(this.createProductRoute.register());
  }
}
