import type { Cart } from "@cart/domain/entities/Cart";
import type { Option } from "@shared/common/Option";

export interface ICartReadRepository {
  findCartByCartId(cartId: string): Promise<Option<Cart>>;
}
