import type { IConfigService } from "@application/config/IConfigService";
import type { Application } from "express";

import express from "express";
import { container } from "tsyringe";

import { ConfigService } from "@infrastructure/config/ConfigService";
import { DI_TOKENS } from "@infrastructure/di/tokens";
import { CartRoutes } from "@infrastructure/routes/CartRoutes";
import { DocumentationRoutes } from "@infrastructure/routes/DocumentationRoutes";
import { HealthCheckRoutes } from "@infrastructure/routes/HealthCheckRoutes";

export class DependencyRegistrar {
  public static registerDependencies(): void {
    container.register<Application>(DI_TOKENS.Application, { useValue: express() });
    container.register<IConfigService>(DI_TOKENS.ConfigService, {
      useClass: ConfigService,
    });

    // Register all routes
    container.register(DI_TOKENS.AppRouterV1, { useClass: HealthCheckRoutes });
    container.register(DI_TOKENS.AppRouterV1, { useClass: CartRoutes });
    container.register(DI_TOKENS.AppRouterV1, { useClass: DocumentationRoutes });
  }
}
