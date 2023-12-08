import type { ICartReadRepository } from "@cart/application/services/ICartReadRepository";
import type { Cart } from "@cart/domain/entities/Cart";

import { Option } from "@shared/common/Option";
import { UniqueEntityId } from "@shared/domain/models/UniqueEntityId";

export class InMemoryCartReadRepository implements ICartReadRepository {
  private _carts: Map<UniqueEntityId, Cart> = new Map();

  findCartByCartId(cartId: string): Promise<Option<Cart>> {
    return Promise.resolve(
      Option.from(this._carts.get(UniqueEntityId.create(cartId).value))
    );
  }
}
