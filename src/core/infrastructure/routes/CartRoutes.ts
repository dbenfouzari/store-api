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
     * /cart:
     *   get:
     *     summary: Get cart.
     *     description: Get cart.
     *     tags:
     *       - Cart
     *     responses:
     *       200:
     *         description: OK
     */
    this.router.get(this.basePath, (req, res) => {
      res.send("OK from cart");
    });

    /**
     * @openapi
     * /cart/{id}:
     *   get:
     *     summary: Get cart by id.
     *     description: Get cart by id.
     *     tags:
     *       - Cart
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *           required: true
     *           description: Cart id.
     *           example: 0a606f22-fb5f-4cd5-b5df-546c7fbc5ee4
     *           format: uuid
     *     responses:
     *       200:
     *         description: OK
     */
    this.router.get(`${this.basePath}/:id`, (req, res) => {
      res.send(`OK from cart with id ${req.params.id}`);
    });

    /**
     * @openapi
     * /cart:
     *   post:
     *     summary: Create cart.
     *     description: Create cart.
     *     tags:
     *       - Cart
     *     parameters:
     *       - in: body
     *         name: body
     *         description: Cart object.
     *         required: true
     *         schema:
     *           type: object
     *           required:
     *             - name
     *           properties:
     *             name:
     *               type: string
     *               description: Cart name.
     */
    this.router.post(this.basePath, (req, res) => {
      res.send("OK from cart");
    });
  }
}
