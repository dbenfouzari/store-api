import type { IJWTService } from "@auth/application/services/IJWTService";
import type { RequestHandler } from "express";

import { container } from "tsyringe";

import { TokenType } from "@auth/application/services/IJWTService";
import { AUTH_TOKENS } from "@auth/di/tokens";

export const ensureUserIsAuthenticated: RequestHandler = (req, res, next) => {
  const jwtService = container.resolve<IJWTService>(AUTH_TOKENS.JWTService);

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      exception: "MissingAuthorizationHeader",
    });
  }

  const [, token] = authHeader.split(" ");

  const verifiedToken = jwtService.verify(token, TokenType.AccessToken);

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
