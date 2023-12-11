import type { Product } from "@product/domain/entities/Product";
import type { Result } from "@shared/common/Result";

export interface IProductWriteRepository {
  createProduct(product: Product): Promise<Result<void, never>>;
}
