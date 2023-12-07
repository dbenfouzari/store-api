import type { IConfigService } from "@application/config/IConfigService";
import type { Application } from "express";

import express from "express";
import { container } from "tsyringe";

import { ConfigService } from "@infrastructure/config/ConfigService";
import { DI_TOKENS } from "@infrastructure/di/tokens";

export class DependencyRegistrar {
  public static registerDependencies(): void {
    container.register<Application>(DI_TOKENS.Application, { useValue: express() });
    container.register<IConfigService>(DI_TOKENS.ConfigService, {
      useClass: ConfigService,
    });
  }
}
