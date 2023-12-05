import type { Cart } from "@domain/entities/Cart";
import type { CartItem } from "@domain/entities/CartItem";
import type { Option } from "@shared/common/Option";

export interface ICartService {
  getCart: () => Promise<Option<Cart>>;
  addItemToCart: (cartItem: CartItem) => Promise<void>;
  removeItemFromCart: (cartItem: CartItem) => Promise<void>;
  updateItemInCart: (cartItem: CartItem) => Promise<void>;
  clearCart: () => Promise<void>;
}
