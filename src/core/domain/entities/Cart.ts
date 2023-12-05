import type { CartItem } from "@domain/entities/CartItem";
import type { UniqueEntityId } from "@shared/domain/models/UniqueEntityId";

import { AggregateRoot } from "@shared/domain/models/AggregateRoot";

type CartProps = {
  items: CartItem[];
};

type CreateCartProps = {
  items?: CartItem[];
};

/**
 * Domain entity representing a cart.
 */
export class Cart extends AggregateRoot<CartProps> {
  /**
   * Creates a new cart.
   * @param props Cart properties.
   * @param id Cart ID.
   */
  private constructor(props: CartProps, id?: UniqueEntityId) {
    super(props, id);
  }

  /**
   * Creates a new cart.
   * @param props Cart properties.
   * @returns Cart.
   */
  static create(props: CreateCartProps = {}) {
    return new Cart({
      items: props.items ?? [],
    });
  }
}
