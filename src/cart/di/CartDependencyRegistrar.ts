import type DependencyContainer from "tsyringe/dist/typings/types/dependency-container";

import { AddProductVariantToCart } from "@cart/application/use-cases/AddProductVariantToCart";
import { CART_TOKENS } from "@cart/di/tokens";
import { CartRoutes } from "@cart/infrastructure/http/routes";
import { AddItemToCartRoute } from "@cart/infrastructure/http/routes/AddItemToCartRoute";
import { InMemoryCartReadRepository } from "@cart/infrastructure/http/services/InMemoryCartReadRepository";
import { DI_TOKENS } from "@infrastructure/di/tokens";

export class CartDependencyRegistrar {
  constructor(private readonly container: DependencyContainer) {}

  public registerDependencies(): void {
    // Register services
    this.container.register(CART_TOKENS.CartReadRepository, {
      useClass: InMemoryCartReadRepository,
    });

    // Register use cases
    this.container.register(CART_TOKENS.AddProductVariantToCartUseCase, {
      useClass: AddProductVariantToCart,
    });

    // Register routes
    this.container.register(DI_TOKENS.AppRouterV1, { useClass: CartRoutes });
    this.container.register(CART_TOKENS.AddItemToCartRoute, {
      useClass: AddItemToCartRoute,
    });
  }
}
