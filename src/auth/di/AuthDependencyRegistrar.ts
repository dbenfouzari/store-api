import type DependencyContainer from "tsyringe/dist/typings/types/dependency-container";

import { GetAllUsers } from "@auth/application/use-cases/GetAllUsers";
import { LogUserInUseCase } from "@auth/application/use-cases/LogUserInUseCase";
import { AUTH_TOKENS } from "@auth/di/tokens";
import { AuthRoutes } from "@auth/infrastructure/http/routes";
import { GetUsersRoute } from "@auth/infrastructure/http/routes/GetUsersRoute";
import { LogUserInRoute } from "@auth/infrastructure/http/routes/LogUserInRoute";
import { InMemoryUserReadRepository } from "@auth/infrastructure/services/InMemoryUserReadRepository";
import { DI_TOKENS } from "@infrastructure/di/tokens";

export class AuthDependencyRegistrar {
  constructor(private readonly container: DependencyContainer) {}

  public registerDependencies(): void {
    // Register services
    this.container.register(AUTH_TOKENS.UserReadRepository, {
      useClass: InMemoryUserReadRepository,
    });

    // Register use cases
    this.container.register(AUTH_TOKENS.GetAllUsersUseCase, {
      useClass: GetAllUsers,
    });
    this.container.register(AUTH_TOKENS.LogUserInUseCase, {
      useClass: LogUserInUseCase,
    });

    // Register routes
    this.container.register(DI_TOKENS.AppRouterV1, { useClass: AuthRoutes });
    this.container.register(AUTH_TOKENS.LogUserInRoute, {
      useClass: LogUserInRoute,
    });
    this.container.register(AUTH_TOKENS.GetUsersRoute, {
      useClass: GetUsersRoute,
    });
  }
}
