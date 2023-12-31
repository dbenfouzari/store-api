import type { PriceExceptions } from "../value-objects/Price";
import type { Result } from "@shared/common/Result";

import { Err, Ok } from "@shared/common/Result";
import { Entity } from "@shared/domain/models/Entity";

import { Price } from "../value-objects/Price";

type ProductVariantProps = {
  /** The name of the product variant. */
  name: string;
  /** The description of the product variant. */
  description?: string;
  /** The price of the product variant. */
  price: Price;
};

export type CreateProductVariantProps = {
  /** The name of the product variant. */
  name: string;
  /** The description of the product variant. */
  description?: string;
  /**
   * The price of the product variant.
   * Can be 0 if the product variant is free.
   * Unit: cents.
   */
  price: number;
};

export enum ProductVariantExceptions {
  NameLength = "ProductVariantNameLength",
}

/**
 * @openapi
 * components:
 *   schemas:
 *     ProductVariant:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the product variant.
 *           example: T-Shirt
 *           minLength: 3
 *           maxLength: 20
 *           nullable: false
 *         description:
 *           type: string
 *           description: The description of the product variant.
 *           example: A t-shirt.
 *           nullable: true
 *           default: null
 *         price:
 *           type: number
 *           description: The price of the product variant in cents.
 *           example: 1000
 *           nullable: false
 *           default: 0
 *           minimum: 1
 *           maximum: 1000000000
 */
/**
 * A product variant is a specific version of a product.
 *
 * For example, a product can be a t-shirt, and a product variant can be a t-shirt of size M.
 */
export class ProductVariant extends Entity<ProductVariantProps> {
  /**
   * The constructor is private because the only way to create a product variant is by using the static factory method.
   * @param props The properties of the product variant.
   */
  private constructor(props: ProductVariantProps) {
    super(props);
  }

  /**
   * The static factory method to create a product variant.
   * @param props The properties of the product variant.
   * @returns A product variant.
   */
  static create(
    props: CreateProductVariantProps
  ): Result<ProductVariant, ProductVariantExceptions | PriceExceptions> {
    const isNameValid = this.validateName(props.name);

    if (!isNameValid) {
      return Err.of(ProductVariantExceptions.NameLength);
    }

    const priceResult = Price.create(props.price);

    if (priceResult.isErr()) {
      return Err.of(priceResult.unwrapErr());
    }

    return Ok.of(
      new this({
        name: props.name,
        description: props.description,
        price: priceResult.unwrap(),
      })
    );
  }

  private static validateName(name: string): boolean {
    return !(name.length < 3 || name.length > 20);
  }
}
