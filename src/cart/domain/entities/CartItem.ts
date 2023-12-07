import type {
  CreateProductVariantProps,
  ProductVariantExceptions,
} from "@product/domain/entities/ProductVariant";
import type { PriceExceptions } from "@product/domain/value-objects/Price";

import { ProductVariant } from "@product/domain/entities/ProductVariant";
import { Result } from "@shared/common/Result";
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

export class CartItem extends Entity<CartItemProps> {
  static create(
    props: CreateCartItemProps
  ): Result<CartItem, CartItemExceptions | ProductVariantExceptions | PriceExceptions> {
    const productVariantResult = ProductVariant.create(props.productVariant);
    const quantityResult = this.validateQuantity(props.quantity ?? 1);

    const result = Result.combine(productVariantResult, quantityResult);

    if (result.isFailure) {
      return Result.fail(result.error);
    }

    return Result.ok(
      new CartItem({
        productVariant: productVariantResult.value,
        quantity: props.quantity ?? 1,
      })
    );
  }

  private static validateQuantity(quantity: number): Result<number, CartItemExceptions> {
    if (quantity <= 0) {
      return Result.fail(CartItemExceptions.QuantityMustBePositive);
    }

    return Result.ok(quantity);
  }

  public addQuantity(quantity: number): Result<void, Error> {
    this.props.quantity += quantity;

    return Result.ok(undefined);
  }
}
