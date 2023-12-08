import type { AddProductVariantToCartExceptions } from "@cart/application/use-cases/AddProductVariantToCart";

import { Router } from "express";
import { inject, injectable } from "tsyringe";

import { AddProductVariantToCart } from "@cart/application/use-cases/AddProductVariantToCart";
import { CART_TOKENS } from "@cart/di/tokens";
import { Option } from "@shared/common/Option";

export type AddItemToCartRequest = {
  itemId?: string;
  quantity?: number;
};

export type AddItemToCartSuccessResponse = {
  success: true;
};

export enum AddItemToCartExceptions {
  NoRequestGiven = "AddItemToCartNoRequestGiven",
}

export type AddItemToCartErrorResponse = {
  success: false;
  exception: AddItemToCartExceptions | AddProductVariantToCartExceptions;
};

export type AddItemToCartResponse =
  | AddItemToCartSuccessResponse
  | AddItemToCartErrorResponse;

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
 *     description: |
 *       Add a `ProductVariant` to the cart.
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
@injectable()
export class AddItemToCartRoute {
  private basePath = "/cart";
  private router = Router();

  constructor(
    @inject(CART_TOKENS.AddProductVariantToCartUseCase)
    private addProductVariantToCartUseCase: AddProductVariantToCart
  ) {}

  public register() {
    this.router.post<undefined, AddItemToCartResponse, AddItemToCartRequest | undefined>(
      `${this.basePath}/add-item`,
      async (req, res) => {
        let bodyOption: Option<AddItemToCartRequest>;

        if (req.body === undefined || Object.keys(req.body).length === 0) {
          bodyOption = Option.none();
        } else {
          bodyOption = Option.some<AddItemToCartRequest>(req.body);
        }

        bodyOption.match(
          async (body) => {
            const result = await this.addProductVariantToCartUseCase.execute({
              cartId: body.itemId ?? "",
              productVariantId: body.itemId ?? "",
              quantity: body.quantity,
            });

            return result.match(
              (result) => {
                res.status(400).json({
                  success: false,
                  exception: result,
                });
              },
              () => {
                res.status(201).json({
                  success: true,
                });
              }
            );
          },
          () => {
            res.status(400).json({
              success: false,
              exception: AddItemToCartExceptions.NoRequestGiven,
            });
          }
        );
      }
    );

    return this.router;
  }
}
