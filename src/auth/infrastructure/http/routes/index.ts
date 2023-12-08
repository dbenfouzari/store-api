import type { IAppRouterV1 } from "@application/routes/IAppRouterV1";

import { Router } from "express";
import { inject, injectable } from "tsyringe";

import { AUTH_TOKENS } from "@auth/di/tokens";
import { GetMeRoute } from "@auth/infrastructure/http/routes/GetMeRoute";
import { LogUserInRoute } from "@auth/infrastructure/http/routes/LogUserInRoute";
import { RefreshUserTokenRoute } from "@auth/infrastructure/http/routes/RefreshUserTokenRoute";

/**
 * @openapi
 * tags:
 *   - name: Auth
 *     description: |
 *       `Auth` operations.
 *   - name: User
 *     description: |
 *       `User` operations.
 * @openapi
 * components:
 *   responses:
 *     UserListResponse:
 *       description: The user response.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - success
 *               - users
 *             properties:
 *               success:
 *                 type: boolean
 *                 description: Whether the request was successful.
 *                 example: true
 *                 nullable: false
 *                 enum: [true]
 *                 default: true
 *               users:
 *                 type: array
 *                 description: The users.
 *                 items:
 *                   $ref: "#/components/schemas/User"
 */
@injectable()
export class AuthRoutes implements IAppRouterV1 {
  _apiVersion = 1000 as const;
  router = Router();

  constructor(
    @inject(AUTH_TOKENS.LogUserInRoute) private logUserInRoute: LogUserInRoute,
    @inject(AUTH_TOKENS.GetMeRoute) private getMeRoute: GetMeRoute,
    @inject(AUTH_TOKENS.RefreshUserTokenRoute)
    private refreshUserTokenRoute: RefreshUserTokenRoute
  ) {
    this.register();
  }

  private register() {
    this.router.use(this.logUserInRoute.register());
    this.router.use(this.getMeRoute.register());
    this.router.use(this.refreshUserTokenRoute.register());
  }
}