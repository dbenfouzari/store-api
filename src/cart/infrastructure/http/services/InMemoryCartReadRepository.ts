import type { ICartReadRepository } from "@cart/application/services/ICartReadRepository";
import type { Cart } from "@cart/domain/entities/Cart";
import type { Option } from "@shared/common/Option";

import { None, Some } from "@shared/common/Option";
import { UniqueEntityId } from "@shared/domain/models/UniqueEntityId";

export class InMemoryCartReadRepository implements ICartReadRepository {
  private _carts: Map<UniqueEntityId, Cart> = new Map();

  async findCartByCartId(cartId: string): Promise<Option<Cart>> {
    const cartOrUndefined = this._carts.get(UniqueEntityId.create(cartId).unwrap());

    if (cartOrUndefined === undefined) {
      return new None();
    }

    return Some.of(cartOrUndefined);
  }
}
