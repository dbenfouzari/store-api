import type { IAppRouterV1 } from "@application/routes/IAppRouterV1";

import { Router } from "express";
import { inject, injectable } from "tsyringe";

import { AUTH_TOKENS } from "@auth/di/tokens";
import { GetUsersRoute } from "@auth/infrastructure/http/routes/GetUsersRoute";
import { LogUserInRoute } from "@auth/infrastructure/http/routes/LogUserInRoute";

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
    @inject(AUTH_TOKENS.GetUsersRoute)
    private getUsersRoute: GetUsersRoute,
    @inject(AUTH_TOKENS.LogUserInRoute) private logUserInRoute: LogUserInRoute
  ) {
    this.register();
  }

  private register() {
    this.router.use(this.getUsersRoute.register());
    this.router.use(this.logUserInRoute.register());
  }
}
