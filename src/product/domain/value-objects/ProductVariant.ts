import { Result } from "@shared/common/Result";
import { ValueObject } from "@shared/domain/models/ValueObject";

import { ProductNameLengthError } from "../errors/ProductNameLengthError";

import { Price } from "./Price";

type ProductVariantProps = {
  /** The name of the product variant. */
  name: string;
  /** The description of the product variant. */
  description?: string;
  /** The price of the product variant. */
  price: Price;
};

type CreateProductVariantProps = {
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

/**
 * A product variant is a specific version of a product.
 *
 * For example, a product can be a t-shirt, and a product variant can be a t-shirt of size M.
 */
export class ProductVariant extends ValueObject<ProductVariantProps> {
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
  ): Result<ProductVariant, ProductNameLengthError> {
    const isNameValid = this.validateName(props.name);

    if (!isNameValid) {
      return Result.fail(new ProductNameLengthError());
    }

    const priceResult = Price.create(props.price);

    if (priceResult.isFailure) {
      return Result.fail(priceResult.error);
    }

    return Result.ok(
      new this({
        name: props.name,
        description: props.description,
        price: priceResult.value,
      })
    );
  }

  private static validateName(name: string): boolean {
    return !(name.length < 3 || name.length > 20);
  }
}
