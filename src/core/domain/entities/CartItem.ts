import type { UniqueEntityId } from "@shared/domain/models/UniqueEntityId";

import { Entity } from "@shared/domain/models/Entity";

export type CartItemProps = {
  productId: string;
  quantity: number;
};

export type CreateCartItemProps = {
  productId: string;
  quantity?: number;
};

export class CartItem extends Entity<CartItemProps> {
  static create(props: CreateCartItemProps, id?: UniqueEntityId) {
    return new this(
      {
        productId: props.productId,
        quantity: props.quantity ?? 1,
      },
      id
    );
  }
}
