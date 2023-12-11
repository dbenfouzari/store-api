import type { IProductWriteRepository } from "@product/application/services/IProductWriteRepository";
import type { Product } from "@product/domain/entities/Product";
import type { Result } from "@shared/common/Result";

import { Ok } from "@shared/common/Result";

export class InMemoryProductRepository implements IProductWriteRepository {
  private _products: Product[] = [];

  async createProduct(product: Product): Promise<Result<void, never>> {
    this._products.push(product);
    return Ok.of(undefined);
  }
}
