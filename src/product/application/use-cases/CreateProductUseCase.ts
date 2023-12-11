/**
 * @file
 * As an admin user, I want to create a product.
 */
import type { ProductVariantExceptions } from "@product/domain/entities/ProductVariant";
import type { PriceExceptions } from "@product/domain/value-objects/Price";
import type { ProductTitleExceptions } from "@product/domain/value-objects/ProductTitle";
import type { IUseCase } from "@shared/application/IUseCase";
import type { Result } from "@shared/common/Result";

import { inject, injectable } from "tsyringe";

import { IProductWriteRepository } from "@product/application/services/IProductWriteRepository";
import { ProductServicesTokens } from "@product/di/tokens";
import { Product } from "@product/domain/entities/Product";
import { Err, Ok } from "@shared/common/Result";

type CreateProductRequest = {
  name: string;
  description: string;
};

type CreateProductSuccessResponse = void;

type CreateProductExceptions =
  | ProductTitleExceptions
  | ProductVariantExceptions
  | PriceExceptions;

type CreateProductResponse = Result<
  CreateProductSuccessResponse,
  CreateProductExceptions
>;

@injectable()
export class CreateProductUseCase
  implements IUseCase<CreateProductRequest, CreateProductResponse>
{
  constructor(
    @inject(ProductServicesTokens.ProductWriteRepository)
    private productWriteRepository: IProductWriteRepository
  ) {}

  async execute(request: CreateProductRequest): Promise<CreateProductResponse> {
    const productResult = Product.create({
      name: request.name,
      description: request.description,
      variants: [
        {
          name: request.name,
          description: request.description,
          price: 0,
        },
      ],
    });

    if (productResult.isErr()) {
      return Err.of(productResult.unwrapErr());
    }

    const saveResult = await this.productWriteRepository.createProduct(
      productResult.unwrap()
    );

    return saveResult.andThen(() => Ok.of(undefined));
  }
}
