import type { IJWTService } from "@auth/application/services/IJWTService";
import type { IUserReadRepository } from "@auth/application/services/IUserReadRepository";
import type { RequestHandler } from "express";

import { container } from "tsyringe";

import { TokenType } from "@auth/application/services/IJWTService";
import { AuthServicesTokens } from "@auth/di/tokens";
import { UserRoles } from "@auth/domain/value-objects/UserRole";

/**-
 * @openapi
 * components:
 *   responses:
 *     Unauthorized:
 *       description: Unauthorized.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - success
 *               - exception
 *             properties:
 *               success:
 *                 type: boolean
 *                 description: Whether the request was successful.
 *                 example: false
 *                 nullable: false
 *                 enum: [false]
 *               exception:
 *                 type: string
 *                 description: The exception.
 *                 example: Unauthorized
 *                 nullable: false
 *                 enum: [Unauthorized]
 *     Forbidden:
 *       description: User has no permission to access this resource.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - success
 *               - exception
 *             properties:
 *               success:
 *                 type: boolean
 *                 description: Whether the request was successful.
 *                 example: false
 *                 nullable: false
 *                 enum: [false]
 *               exception:
 *                 type: string
 *                 description: The exception.
 *                 example: Forbidden
 *                 nullable: false
 *                 enum: [Forbidden]
 */
export const ensureUserIsAdmin: RequestHandler = async (req, res, next) => {
  const jwtService = container.resolve<IJWTService>(AuthServicesTokens.JWTService);
  const userReadRepository = container.resolve<IUserReadRepository>(
    AuthServicesTokens.UserReadRepository
  );

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return returnUnauthorized(res);
  }

  const [, token] = authHeader.split(" ");

  const verifiedToken = jwtService.verify(token, TokenType.AccessToken);

  if (verifiedToken.isNone()) {
    return returnUnauthorized(res);
  }

  const maybeUser = await userReadRepository.getUserById(verifiedToken.unwrap().sub);

  if (maybeUser.isNone()) {
    return returnUnauthorized(res);
  }

  if (maybeUser.unwrap().props.role.props.value !== UserRoles.ADMIN) {
    return res.status(403).json({
      success: false,
      exception: "Forbidden",
    });
  }

  next();
};

/**
 *
 * @param res
 */
function returnUnauthorized(res: any) {
  return res.status(401).json({
    success: false,
    exception: "Unauthorized",
  });
}
