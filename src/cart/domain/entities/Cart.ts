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

/**
 * @openapi
 * components:
 *   schemas:
 *     Cart:
 *       type: object
 *       required:
 *         - id
 *         - createdAt
 *         - updatedAt
 *         - ownerId
 *         - items
 *       properties:
 *         id:
 *           type: string
 *           description: The ID of the cart.
 *           format: uuid
 *           example: 123e4567-e89b-12d3-a456-426614174000
 *           nullable: false
 *           unique: true
 *         ownerId:
 *           type: string
 *           description: The ID of the owner of the cart.
 *           format: uuid
 *           example: 123e4567-e89b-12d3-a456-426614174000
 *           nullable: false
 *         items:
 *           type: array
 *           description: The items in the cart.
 *           items:
 *             $ref: '#/components/schemas/CartItem'
 *             nullable: false
 *         createdAt:
 *           type: string
 *           description: The date and time the cart was created.
 *           format: date-time
 *           example: 2021-01-01T00:00:00.000Z
 *           required: true
 *         updatedAt:
 *           type: string
 *           description: The date and time the cart was last updated.
 *           format: date-time
 *           example: 2021-01-01T00:00:00.000Z
 *           required: true
 */
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
}
