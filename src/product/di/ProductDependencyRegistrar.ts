import type DependencyContainer from "tsyringe/dist/typings/types/dependency-container";

import { DI_TOKENS } from "@infrastructure/di/tokens";
import { CreateProductUseCase } from "@product/application/use-cases/CreateProductUseCase";
import {
  ProductRoutesTokens,
  ProductServicesTokens,
  ProductUseCasesTokens,
} from "@product/di/tokens";
import { ProductRoutes } from "@product/infrastructure/http/routes";
import { CreateProductRoute } from "@product/infrastructure/http/routes/CreateProductRoute";
import { InMemoryProductRepository } from "@product/infrastructure/services/InMemoryProductRepository";

export class ProductDependencyRegistrar {
  constructor(private readonly container: DependencyContainer) {}

  public registerDependencies(): void {
    // Register services
    this.container.register(ProductServicesTokens.ProductReadRepository, {
      useClass: InMemoryProductRepository,
    });
    this.container.register(ProductServicesTokens.ProductWriteRepository, {
      useClass: InMemoryProductRepository,
    });

    // Register use cases
    this.container.register(ProductUseCasesTokens.CreateProductUseCase, {
      useClass: CreateProductUseCase,
    });

    // Register routes
    this.container.register(DI_TOKENS.AppRouterV1, { useClass: ProductRoutes });
    this.container.register(ProductRoutesTokens.CreateProductRoute, {
      useClass: CreateProductRoute,
    });
  }
}
