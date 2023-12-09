import type DependencyContainer from "tsyringe/dist/typings/types/dependency-container";

import { GetMeUseCase } from "@auth/application/use-cases/GetMeUseCase";
import { LogUserInUseCase } from "@auth/application/use-cases/LogUserInUseCase";
import { LogUserOutUseCase } from "@auth/application/use-cases/LogUserOutUseCase";
import { RefreshUserTokenUseCase } from "@auth/application/use-cases/RefreshUserTokenUseCase";
import { SignUserUpUseCase } from "@auth/application/use-cases/SignUserUpUseCase";
import {
  AuthRoutesTokens,
  AuthServicesTokens,
  AuthUseCasesTokens,
} from "@auth/di/tokens";
import { AuthRoutes } from "@auth/infrastructure/http/routes";
import { GetMeRoute } from "@auth/infrastructure/http/routes/GetMeRoute";
import { LogUserInRoute } from "@auth/infrastructure/http/routes/LogUserInRoute";
import { LogUserOutRoute } from "@auth/infrastructure/http/routes/LogUserOutRoute";
import { RefreshUserTokenRoute } from "@auth/infrastructure/http/routes/RefreshUserTokenRoute";
import { SignUserUpRoute } from "@auth/infrastructure/http/routes/SignUserUpRoute";
import { FileUserRepository } from "@auth/infrastructure/services/FileUserRepository";
import { JWTService } from "@auth/infrastructure/services/JWTService";
import { DI_TOKENS } from "@infrastructure/di/tokens";

export class AuthDependencyRegistrar {
  constructor(private readonly container: DependencyContainer) {}

  public registerDependencies(): void {
    // Register services
    this.container.register(AuthServicesTokens.UserReadRepository, {
      useClass: FileUserRepository,
    });
    this.container.register(AuthServicesTokens.UserWriteRepository, {
      useClass: FileUserRepository,
    });
    this.container.register(AuthServicesTokens.JWTService, { useClass: JWTService });

    // Register use cases
    this.container.register(AuthUseCasesTokens.LogUserInUseCase, {
      useClass: LogUserInUseCase,
    });
    this.container.register(AuthUseCasesTokens.GetMeUseCase, {
      useClass: GetMeUseCase,
    });
    this.container.register(AuthUseCasesTokens.RefreshUserTokenUseCase, {
      useClass: RefreshUserTokenUseCase,
    });
    this.container.register(AuthUseCasesTokens.SignUserUpUseCase, {
      useClass: SignUserUpUseCase,
    });
    this.container.register(AuthUseCasesTokens.LogUserOutUseCase, {
      useClass: LogUserOutUseCase,
    });

    // Register routes
    this.container.register(DI_TOKENS.AppRouterV1, { useClass: AuthRoutes });
    this.container.register(AuthRoutesTokens.LogUserInRoute, {
      useClass: LogUserInRoute,
    });
    this.container.register(AuthRoutesTokens.GetMeRoute, {
      useClass: GetMeRoute,
    });
    this.container.register(AuthRoutesTokens.RefreshUserTokenRoute, {
      useClass: RefreshUserTokenRoute,
    });
    this.container.register(AuthRoutesTokens.SignUserUpRoute, {
      useClass: SignUserUpRoute,
    });
    this.container.register(AuthRoutesTokens.LogUserOutRoute, {
      useClass: LogUserOutRoute,
    });
  }
}
