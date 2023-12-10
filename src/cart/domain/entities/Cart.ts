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
import type { Option } from "@shared/common/Option";
import type { Result } from "@shared/common/Result";
import type { UniqueEntityIdExceptions } from "@shared/domain/models/UniqueEntityId";
import type { DateTimeExceptions } from "@shared/domain/value-objects/DateTime";

import { Left, Right } from "@shared/common/Either";
import { None, Some } from "@shared/common/Option";
import { Err, Ok } from "@shared/common/Result";
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

type GetCartItemsExceptions =
  | CartItemExceptions
  | ProductVariantExceptions
  | PriceExceptions;

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
 *         updatedAt:
 *           type: string
 *           description: The date and time the cart was last updated.
 *           format: date-time
 *           example: 2021-01-01T00:00:00.000Z
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

    return ownerId.andThen((ownerId) => {
      return createdAt.andThen((createdAt) => {
        return updatedAt.andThen((updatedAt) => {
          return cartItemsResult.andThen((cartItems) => {
            return Ok.of(
              new Cart({
                createdAt: createdAt,
                updatedAt: updatedAt,
                ownerId: ownerId,
                items: cartItems,
              })
            );
          });
        });
      });
    });
  }

  private static getValueAsOption(
    value: string | DateTime | undefined
  ): Option<Either<DateTime, string>> {
    if (typeof value === "string") {
      return Some.of(Right.from<DateTime, string>(value));
    }

    if (value instanceof DateTime) {
      return Some.of(Left.from<DateTime, string>(value));
    }

    return new None();
  }

  private static getCartItems(
    items: CreateCartItemProps[] | undefined
  ): Result<Set<CartItem>, GetCartItemsExceptions> {
    if (!items) {
      return Ok.of(new Set());
    }

    const cartItemsResult = items.map((item) => CartItem.create(item));

    // combine items results into a single result
    const result = cartItemsResult.reduce(
      (acc, curr) => {
        return acc.andThen(() => curr);
      },
      Ok.of(undefined) as unknown as Result<CartItem, GetCartItemsExceptions>
    );

    if (result.isErr()) {
      return Err.of(result.unwrapErr());
    }

    return Ok.of(new Set(cartItemsResult.map((result) => result.unwrap())));
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

    if (cartItemResult.isErr()) {
      return Err.of(cartItemResult.unwrapErr());
    }

    this.props.items.add(cartItemResult.unwrap());

    return Ok.of(undefined);
  }
}
