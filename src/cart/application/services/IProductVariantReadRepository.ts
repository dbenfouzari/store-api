import type { ProductVariant } from "@product/domain/entities/ProductVariant";
import type { Option } from "@shared/common/Option";

export interface IProductVariantReadRepository {
  findProductVariantByProductVariantId(
    productVariantId: string
  ): Promise<Option<ProductVariant>>;
}
