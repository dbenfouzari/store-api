import type { IProductVariantReadRepository } from "@product/application/services/IProductVariantReadRepository";
import type { ProductVariant } from "@product/domain/entities/ProductVariant";
import type { Option } from "@shared/common/Option";

import { None, Some } from "@shared/common/Option";
import { UniqueEntityId } from "@shared/domain/models/UniqueEntityId";

export class InMemoryProductVariantReadRepository
  implements IProductVariantReadRepository
{
  private _productVariants: Map<UniqueEntityId, ProductVariant> = new Map();

  async findProductVariantByProductVariantId(
    productVariantId: string
  ): Promise<Option<ProductVariant>> {
    const productVariantOrUndefined = this._productVariants.get(
      UniqueEntityId.create(productVariantId).unwrap()
    );

    if (productVariantOrUndefined === undefined) {
      return new None();
    }

    return Some.of(productVariantOrUndefined);
  }
}
