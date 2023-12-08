import type { IAppRouterV1 } from "@application/routes/IAppRouterV1";

import { Router } from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { inject, injectable } from "tsyringe";
import { Document } from "yaml";

import { IConfigService } from "@application/config/IConfigService";
import { DI_TOKENS } from "@infrastructure/di/tokens";

/**
 * @openapi
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   responses:
 *     UnexpectedErrorResponse:
 *       description: An unexpected error occurred.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - success
 *               - message
 *             properties:
 *               success:
 *                 type: boolean
 *                 description: Whether the request was successful.
 *                 example: false
 *                 nullable: false
 *                 enum: [false]
 *                 default: false
 *               message:
 *                 type: string
 *                 description: The error message.
 *                 nullable: false
 *                 example: An unexpected error occurred.
 */
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
      apis: ["./src/**/*.ts"],
    });

    this.router.use("/api-docs-json", (_req, res) => {
      res.setHeader("Content-Type", "application/json");
      res.send(swaggerSpec);
    });

    this.router.use("/api-docs-yaml", (_req, res) => {
      res.setHeader("Content-Type", "application/x-yaml");
      const doc = new Document(swaggerSpec);

      res.send(doc.toString());
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
