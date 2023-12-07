import type { IAppRouterV1 } from "@application/routes/IAppRouterV1";

import { Router } from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { inject, injectable } from "tsyringe";

import { IConfigService } from "@application/config/IConfigService";
import { DI_TOKENS } from "@infrastructure/di/tokens";

@injectable()
export class DocumentationRoutes implements IAppRouterV1 {
  public _apiVersion = 1000 as const;
  public router = Router();

  constructor(@inject(DI_TOKENS.ConfigService) private configService: IConfigService) {
    this.register();
  }

  private register() {
    const port = this.configService.get("PORT");
    const host = this.configService.get("HOST");

    const swaggerSpec = swaggerJSDoc({
      failOnErrors: true,
      definition: {
        openapi: "3.0.0",
        host: host,
        info: {
          title: "API Documentation",
          version: "1.0.0",
          description: "API Documentation",
        },
        servers: [
          {
            url: `${host}:${port}/api/v1`,
          },
        ],
      },
      apis: ["./src/core/infrastructure/routes/**/*.ts"],
    });

    this.router.use(
      "/api-docs",
      swaggerUi.serve,
      swaggerUi.setup(swaggerSpec, {
        explorer: true,
        customCssUrl:
          "https://cdn.jsdelivr.net/npm/swagger-ui-themes@3.0.1/themes/3.x/theme-flattop.min.css",
      })
    );
  }
}
