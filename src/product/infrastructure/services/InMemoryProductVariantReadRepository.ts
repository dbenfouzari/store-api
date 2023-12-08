import type { IProductVariantReadRepository } from "@product/application/services/IProductVariantReadRepository";
import type { ProductVariant } from "@product/domain/entities/ProductVariant";

import { Option } from "@shared/common/Option";
import { UniqueEntityId } from "@shared/domain/models/UniqueEntityId";

export class InMemoryProductVariantReadRepository
  implements IProductVariantReadRepository
{
  private _productVariants: Map<UniqueEntityId, ProductVariant> = new Map();

  findProductVariantByProductVariantId(productVariantId: string) {
    return Promise.resolve(
      Option.from(
        this._productVariants.get(UniqueEntityId.create(productVariantId).value)
      )
    );
  }
}
