import type { Cart } from "@cart/domain/entities/Cart";
import type { Option } from "@shared/common/Option";

export interface ICartReadRepository {
  findCartByOwnerId(ownerId: string): Promise<Option<Cart>>;
  findCartByCartId(cartId: string): Promise<Option<Cart>>;
}
