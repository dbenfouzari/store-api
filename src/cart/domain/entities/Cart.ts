import type { CreateCartItemProps, CartItemExceptions } from "./CartItem";
import type { CartCreationDateExceptions } from "../value-objects/CartCreationDate";
import type { CartUpdateDateExceptions } from "../value-objects/CartUpdateDate";
import type {
  ProductVariantExceptions,
  ProductVariant,
  CreateProductVariantProps,
} from "@product/domain/entities/ProductVariant";
import type { PriceExceptions } from "@product/domain/value-objects/Price";
import type { Either } from "@shared/common/Either";
import type { UniqueEntityIdExceptions } from "@shared/domain/models/UniqueEntityId";
import type { DateTimeExceptions } from "@shared/domain/value-objects/DateTime";

import { Left, Right } from "@shared/common/Either";
import { Option } from "@shared/common/Option";
import { Result } from "@shared/common/Result";
import { AggregateRoot } from "@shared/domain/models/AggregateRoot";
import { UniqueEntityId } from "@shared/domain/models/UniqueEntityId";
import { DateTime } from "@shared/domain/value-objects/DateTime";

import { CartCreationDate } from "../value-objects/CartCreationDate";
import { CartUpdateDate } from "../value-objects/CartUpdateDate";

import { CartItem } from "./CartItem";

type CartProps = {
  createdAt: CartCreationDate;
  updatedAt: CartUpdateDate;
  ownerId: UniqueEntityId;
  items: Set<CartItem>;
};

export type CreateCartProps = {
  createdAt?: DateTime | string;
  updatedAt?: DateTime | string;
  ownerId: UniqueEntityId | string;
  items?: CreateCartItemProps[];
};

export class Cart extends AggregateRoot<CartProps> {
  static create(
    props: CreateCartProps
  ): Result<
    Cart,
    | UniqueEntityIdExceptions
    | CartCreationDateExceptions
    | CartUpdateDateExceptions
    | CartItemExceptions
    | ProductVariantExceptions
    | PriceExceptions
    | DateTimeExceptions
  > {
    const ownerId = UniqueEntityId.create(props.ownerId);
    const createdAt = CartCreationDate.create(this.getValueAsOption(props.createdAt));
    const updatedAt = CartUpdateDate.create(this.getValueAsOption(props.updatedAt));

    const cartItemsResult = this.getCartItems(props.items);

    const result = Result.combine(ownerId, createdAt, updatedAt, cartItemsResult);

    if (result.isFailure) {
      return Result.fail(result.error);
    }

    return Result.ok(
      new Cart({
        createdAt: createdAt.value,
        updatedAt: updatedAt.value,
        ownerId: ownerId.value,
        items: cartItemsResult.value,
      })
    );
  }

  private static getValueAsOption(
    value: string | DateTime | undefined
  ): Option<Either<DateTime, string>> {
    if (typeof value === "string") {
      return Option.some(Right.from<DateTime, string>(value));
    }

    if (value instanceof DateTime) {
      return Option.some(Left.from<DateTime, string>(value));
    }

    return Option.none();
  }

  private static getCartItems(
    items: CreateCartItemProps[] | undefined
  ): Result<
    Set<CartItem>,
    CartItemExceptions | ProductVariantExceptions | PriceExceptions
  > {
    if (!items) {
      return Result.ok(new Set());
    }

    const cartItemsResult = items.map((item) => CartItem.create(item));
    const result = Result.combine(...cartItemsResult);

    if (result.isFailure) {
      return Result.fail(result.error);
    }

    return Result.ok(new Set(cartItemsResult.map((result) => result.value)));
  }

  public addProductVariant(
    productVariant: ProductVariant,
    quantity?: number
  ): Result<void, CartItemExceptions | ProductVariantExceptions | PriceExceptions> {
    const cartItemResult = CartItem.create({
      productVariant: {
        name: productVariant.props.name,
        price: productVariant.props.price.asCents,
      } as CreateProductVariantProps,
      quantity,
    });

    if (cartItemResult.isFailure) {
      return Result.fail(cartItemResult.error);
    }

    this.props.items.add(cartItemResult.value);

    return Result.ok(undefined);
  }

  private getExistingCartItemForProductVariant(
    productVariant: ProductVariant
  ): Option<CartItem> {
    return Option.from(
      Array.from(this.props.items).find((item) =>
        item.props.productVariant.equals(productVariant)
      )
    );
  }

  private addQuantityToCartItem(
    cartItem: CartItem,
    quantity: number
  ): Result<void, Error> {
    const result = cartItem.addQuantity(quantity);

    if (result.isFailure) {
      return Result.fail(result.error);
    }

    return Result.ok(undefined);
  }
}
