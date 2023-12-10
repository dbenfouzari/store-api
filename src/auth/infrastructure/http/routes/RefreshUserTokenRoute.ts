import { Router } from "express";
import { inject, injectable } from "tsyringe";

import { RefreshUserTokenUseCase } from "@auth/application/use-cases/RefreshUserTokenUseCase";
import { AuthUseCasesTokens } from "@auth/di/tokens";

/**
 * @openapi
 * components:
 *   requestBodies:
 *     RefreshTokenRequest:
 *       description: Refresh token request.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: The refresh token to be refreshed.
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 nullable: false
 *                 format: jwt
 */
export type RefreshTokenRequest = {
  refreshToken: string;
};

/**
 * @openapi
 * components:
 *   responses:
 *     RefreshTokenSuccessResponse:
 *       description: Refresh token response.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - success
 *               - accessToken
 *             properties:
 *               success:
 *                 type: boolean
 *                 description: Whether the request was successful.
 *                 example: true
 *                 nullable: false
 *                 format: boolean
 *                 default: true
 *                 enum: [true]
 *               accessToken:
 *                 type: string
 *                 description: The access token.
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 nullable: false
 *                 format: jwt
 */
export type RefreshTokenSuccessResponse = {
  success: true;
  accessToken: string;
};

/**
 * @openapi
 * components:
 *   responses:
 *     RefreshTokenErrorResponse:
 *       description: Refresh token response.
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
 *                 format: boolean
 *                 default: false
 *                 enum: [false]
 *               exception:
 *                 type: string
 *                 description: The exception message.
 *                 example: INVALID_REFRESH_TOKEN
 *                 nullable: false
 *                 format: string
 *                 default: INVALID_REFRESH_TOKEN
 */
export type RefreshTokenErrorResponse = {
  success: false;
  exception: string;
};

export type RefreshTokenResponse =
  | RefreshTokenSuccessResponse
  | RefreshTokenErrorResponse;

/**
 * @openapi
 * /auth/refresh-token:
 *   post:
 *     tags: [Auth]
 *     summary: Refresh user token.
 *     description: Refresh user token
 *     requestBody:
 *       $ref: "#/components/requestBodies/RefreshTokenRequest"
 *     responses:
 *       200:
 *         $ref: "#/components/responses/RefreshTokenSuccessResponse"
 *       400:
 *         $ref: "#/components/responses/RefreshTokenErrorResponse"
 */
@injectable()
export class RefreshUserTokenRoute {
  private router = Router();

  constructor(
    @inject(AuthUseCasesTokens.RefreshUserTokenUseCase)
    private refreshUserTokenUseCase: RefreshUserTokenUseCase
  ) {}

  public register() {
    this.router.post<undefined, RefreshTokenResponse, RefreshTokenRequest, undefined>(
      "/auth/refresh-token",
      async (req, res) => {
        const request: RefreshTokenRequest = req.body;
        const response = await this.refreshUserTokenUseCase.execute(request);

        return response.match(
          (success) => {
            res.status(200).json({
              success: true,
              accessToken: success.accessToken,
            });
          },
          (exception) => {
            res.status(400).json({
              success: false,
              exception: exception,
            });
          }
        );
      }
    );

    return this.router;
  }
}
