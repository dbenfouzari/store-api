import type { IUseCase } from "@shared/application/IUseCase";
import type { Result } from "@shared/common/Result";

import { inject, injectable } from "tsyringe";

import { ICartReadRepository } from "@cart/application/services/ICartReadRepository";
import { CART_TOKENS } from "@cart/di/tokens";
import { DI_TOKENS } from "@infrastructure/di/tokens";
import { IProductVariantReadRepository } from "@product/application/services/IProductVariantReadRepository";
import { Err, Ok } from "@shared/common/Result";

export type AddProductVariantToCartRequest = {
  /** The ID of the cart to add the product variant to. */
  cartId: string;
  /** The ID of the product variant to add to the cart. */
  productVariantId: string;
  /**
   * The quantity of the product variant to add to the cart.
   * @default 1
   */
  quantity?: number;
};

export enum AddProductVariantToCartExceptions {
  CartNotFound = "AddProductVariantToCartCartNotFound",
  ProductVariantNotFound = "AddProductVariantToCartProductVariantNotFound",
}

export type AddProductVariantToCartResponse = Result<
  void,
  AddProductVariantToCartExceptions
>;

@injectable()
export class AddProductVariantToCart
  implements IUseCase<AddProductVariantToCartRequest, AddProductVariantToCartResponse>
{
  constructor(
    @inject(CART_TOKENS.CartReadRepository)
    private cartReadRepository: ICartReadRepository,
    @inject(DI_TOKENS.ProductVariantReadRepository)
    private productVariantReadRepository: IProductVariantReadRepository
  ) {}

  async execute(
    request: AddProductVariantToCartRequest
  ): Promise<AddProductVariantToCartResponse> {
    const cart = await this.cartReadRepository.findCartByCartId(request.cartId);
    const productVariant =
      await this.productVariantReadRepository.findProductVariantByProductVariantId(
        request.productVariantId
      );

    if (cart.isNone()) {
      return Err.of(AddProductVariantToCartExceptions.CartNotFound);
    }

    if (productVariant.isNone()) {
      return Err.of(AddProductVariantToCartExceptions.ProductVariantNotFound);
    }

    cart.unwrap().addProductVariant(productVariant.unwrap(), request.quantity ?? 1);

    return Ok.of(undefined);
  }
}
