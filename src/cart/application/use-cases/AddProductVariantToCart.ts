import type { ICartReadRepository } from "@cart/application/services/ICartReadRepository";
import type { IProductVariantReadRepository } from "@cart/application/services/IProductVariantReadRepository";
import type { IUseCase } from "@shared/domain/models/UseCase";

import { Result } from "@shared/common/Result";

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

export class AddProductVariantToCart
  implements IUseCase<AddProductVariantToCartRequest, AddProductVariantToCartResponse>
{
  constructor(
    private readonly cartReadRepository: ICartReadRepository,
    private readonly productVariantReadRepository: IProductVariantReadRepository
  ) {}

  async execute(
    request: AddProductVariantToCartRequest
  ): Promise<AddProductVariantToCartResponse> {
    const cart = await this.cartReadRepository.findCartByCartId(request.cartId);
    const productVariant =
      await this.productVariantReadRepository.findProductVariantByProductVariantId(
        request.productVariantId
      );

    return cart.match(
      (cart) =>
        productVariant.match<Result<any, any>>(
          (productVariant) => {
            cart.addProductVariant(productVariant, request.quantity ?? 1);
            return Result.ok(undefined);
          },
          () => Result.fail(AddProductVariantToCartExceptions.ProductVariantNotFound)
        ),
      () => Result.fail(AddProductVariantToCartExceptions.CartNotFound)
    );
  }
}
