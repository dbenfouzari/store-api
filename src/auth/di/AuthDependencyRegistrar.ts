import type DependencyContainer from "tsyringe/dist/typings/types/dependency-container";

import { GetAllUsers } from "@auth/application/use-cases/GetAllUsers";
import { GetMeUseCase } from "@auth/application/use-cases/GetMeUseCase";
import { LogUserInUseCase } from "@auth/application/use-cases/LogUserInUseCase";
import { RefreshUserTokenUseCase } from "@auth/application/use-cases/RefreshUserTokenUseCase";
import { AUTH_TOKENS } from "@auth/di/tokens";
import { AuthRoutes } from "@auth/infrastructure/http/routes";
import { GetMeRoute } from "@auth/infrastructure/http/routes/GetMeRoute";
import { GetUsersRoute } from "@auth/infrastructure/http/routes/GetUsersRoute";
import { LogUserInRoute } from "@auth/infrastructure/http/routes/LogUserInRoute";
import { RefreshUserTokenRoute } from "@auth/infrastructure/http/routes/RefreshUserTokenRoute";
import { InMemoryUserReadRepository } from "@auth/infrastructure/services/InMemoryUserReadRepository";
import { JWTService } from "@auth/infrastructure/services/JWTService";
import { DI_TOKENS } from "@infrastructure/di/tokens";

export class AuthDependencyRegistrar {
  constructor(private readonly container: DependencyContainer) {}

  public registerDependencies(): void {
    // Register services
    this.container.register(AUTH_TOKENS.UserReadRepository, {
      useClass: InMemoryUserReadRepository,
    });
    this.container.register(AUTH_TOKENS.JWTService, { useClass: JWTService });

    // Register use cases
    this.container.register(AUTH_TOKENS.GetAllUsersUseCase, {
      useClass: GetAllUsers,
    });
    this.container.register(AUTH_TOKENS.LogUserInUseCase, {
      useClass: LogUserInUseCase,
    });
    this.container.register(AUTH_TOKENS.GetMeUseCase, {
      useClass: GetMeUseCase,
    });
    this.container.register(AUTH_TOKENS.RefreshUserTokenUseCase, {
      useClass: RefreshUserTokenUseCase,
    });

    // Register routes
    this.container.register(DI_TOKENS.AppRouterV1, { useClass: AuthRoutes });
    this.container.register(AUTH_TOKENS.LogUserInRoute, {
      useClass: LogUserInRoute,
    });
    this.container.register(AUTH_TOKENS.GetUsersRoute, {
      useClass: GetUsersRoute,
    });
    this.container.register(AUTH_TOKENS.GetMeRoute, {
      useClass: GetMeRoute,
    });
    this.container.register(AUTH_TOKENS.RefreshUserTokenRoute, {
      useClass: RefreshUserTokenRoute,
    });
  }
}
