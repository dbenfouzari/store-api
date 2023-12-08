import type DependencyContainer from "tsyringe/dist/typings/types/dependency-container";

import { GetUserByEmail } from "@auth/application/use-cases/GetUserByEmail";
import { AUTH_TOKENS } from "@auth/di/tokens";
import { InMemoryUserReadRepository } from "@auth/infrastructure/services/InMemoryUserReadRepository";

export class AuthDependencyRegistrar {
  constructor(private readonly container: DependencyContainer) {}

  public registerDependencies(): void {
    // Register services
    this.container.register(AUTH_TOKENS.UserReadRepository, {
      useClass: InMemoryUserReadRepository,
    });

    // Register use cases
    this.container.register(AUTH_TOKENS.GetUserByEmail, {
      useClass: GetUserByEmail,
    });

    // Register routes
    // this.container.register(DI_TOKENS.AppRouterV1, { useClass: CartRoutes });
    // this.container.register(AUTH_TOKENS.AddItemToCartRoute, {
    //   useClass: AddItemToCartRoute,
    // });
  }
}
