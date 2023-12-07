import type { IAppRouterV1 } from "@application/routes/IAppRouterV1";

import { Router } from "express";
import { injectable } from "tsyringe";

/**
 * @openapi
 * tags:
 *   name: Cart
 *   description: Cart operations.
 */
@injectable()
export class CartRoutes implements IAppRouterV1 {
  public _apiVersion = 1000 as const;
  private basePath = "/cart";
  public router = Router();

  constructor() {
    this.register();
  }

  private register() {
    /**
     * @openapi
     * components:
     *   schemas:
     *     AddItemToCartRequest:
     *       type: object
     *       properties:
     *         itemId:
     *           type: string
     *           description: The ID of the item to add to the cart.
     *           format: uuid
     *           example: 123e4567-e89b-12d3-a456-426614174000
     *           required: true
     *         quantity:
     *           type: number
     *           description: The quantity of the item to add to the cart.
     *           example: 1
     *           required: true
     *           default: 1
     *           minimum: 1
     *           nullable: false
     *
     * /cart/add-item:
     *   post:
     *     tags: [Cart]
     *     summary: Add an item to the cart.
     *     description: Add a `ProductVariant` to the cart.
     *     requestBody:
     *       description: The request body.
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/AddItemToCartRequest'
     *     responses:
     *       201:
     *         description: The item was added to the cart.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Cart'
     */
    this.router.post(`${this.basePath}/add-item`, (req, res) => {
      res.send("Hello World!");
    });
  }
}
