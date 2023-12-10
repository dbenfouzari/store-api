import type {
  CreateProductVariantProps,
  ProductVariantExceptions,
} from "@product/domain/entities/ProductVariant";
import type { PriceExceptions } from "@product/domain/value-objects/Price";
import type { Result } from "@shared/common/Result";

import { ProductVariant } from "@product/domain/entities/ProductVariant";
import { Err, Ok } from "@shared/common/Result";
import { Entity } from "@shared/domain/models/Entity";

type CartItemProps = {
  productVariant: ProductVariant;
  quantity: number;
};

export type CreateCartItemProps = {
  productVariant: CreateProductVariantProps;
  quantity?: number;
};

export enum CartItemExceptions {
  QuantityMustBePositive = "CartItemQuantityMustBePositive",
}

/**
 * @openapi
 * components:
 *   schemas:
 *     CartItem:
 *       type: object
 *       required:
 *         - productVariant
 *         - quantity
 *       properties:
 *         productVariant:
 *           $ref: '#/components/schemas/ProductVariant'
 *           description: The product variant.
 *           nullable: false
 *         quantity:
 *           type: number
 *           description: The quantity of the product variant.
 *           example: 1
 */
export class CartItem extends Entity<CartItemProps> {
  static create(
    props: CreateCartItemProps
  ): Result<CartItem, CartItemExceptions | ProductVariantExceptions | PriceExceptions> {
    const productVariantResult = ProductVariant.create(props.productVariant);
    const quantityResult = this.validateQuantity(props.quantity ?? 1);

    return productVariantResult.andThen((productVariant) => {
      return quantityResult.map((quantity) => {
        return new CartItem({
          productVariant,
          quantity,
        });
      });
    });
  }

  private static validateQuantity(quantity: number): Result<number, CartItemExceptions> {
    if (quantity <= 0) {
      return Err.of(CartItemExceptions.QuantityMustBePositive);
    }

    return Ok.of(quantity);
  }

  public addQuantity(quantity: number): Result<void, Error> {
    this.props.quantity += quantity;

    return Ok.of(undefined);
  }
}
