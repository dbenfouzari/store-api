import type { IJWTService } from "@auth/application/services/IJWTService";
import type { IAppLogger } from "@shared/application/IAppLogger";
import type { RequestHandler } from "express";

import { container } from "tsyringe";

import { TokenType } from "@auth/application/services/IJWTService";
import { AuthServicesTokens } from "@auth/di/tokens";
import { SharedTokens } from "@shared/di/tokens";

export const ensureUserIsAuthenticated: RequestHandler = (req, res, next) => {
  const jwtService = container.resolve<IJWTService>(AuthServicesTokens.JWTService);
  const logger = container.resolve<IAppLogger>(SharedTokens.AppLogger);

  const authHeader = req.headers.authorization;

  logger.trace("ensureUserIsAuthenticated.impl", { authHeader });

  if (!authHeader) {
    logger.trace("ensureUserIsAuthenticated.impl", "MissingAuthorizationHeader");
    return res.status(401).json({
      success: false,
      exception: "MissingAuthorizationHeader",
    });
  }

  const [, token] = authHeader.split(" ");

  logger.trace("ensureUserIsAuthenticated.impl", { token });

  const verifiedToken = jwtService.verify(token, TokenType.AccessToken);

  logger.trace("ensureUserIsAuthenticated.impl", { verifiedToken });

  return verifiedToken.match(
    () => {
      req.user = verifiedToken.unwrap();
      next();
    },
    () =>
      res.status(401).json({
        success: false,
        exception: "InvalidToken",
      })
  );
};
