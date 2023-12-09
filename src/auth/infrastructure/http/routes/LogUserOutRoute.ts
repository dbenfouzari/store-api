import type { Response } from "express";

import { Router } from "express";
import { inject, injectable } from "tsyringe";

import { LogUserOutUseCase } from "@auth/application/use-cases/LogUserOutUseCase";
import { AuthUseCasesTokens } from "@auth/di/tokens";
import { ensureUserIsAuthenticated } from "@auth/infrastructure/http/middlewares/ensureUserIsAuthenticated";

/**
 * @openapi
 * components:
 *   responses:
 *     LogUserOutErrorResponse:
 *       description: Error response.
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
 *                 description: Indicates if the request was successful.
 *                 example: false
 *                 nullable: false
 *                 enum: [false]
 *               exception:
 *                 type: string
 *                 description: The exception message.
 *                 example: User not found
 *                 nullable: false
 *                 enum:
 *                   - EmailExceptions
 *                   - LogUserOutUseCaseErrors
 *                   - Error
 */
type LogUserOutErrorResponse = {
  success: false;
  exception: string;
};

type LogUserOutResponse = LogUserOutErrorResponse;

/**
 * @openapi
 * /auth/logout:
 *   delete:
 *     tags: [Auth]
 *     summary: Log user out.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '204':
 *         description: User logged out successfully.
 */
@injectable()
export class LogUserOutRoute {
  private router = Router();

  constructor(
    @inject(AuthUseCasesTokens.LogUserOutUseCase)
    private logUserOutUseCase: LogUserOutUseCase
  ) {}

  public register(): Router {
    this.router.delete(
      "/auth/logout",
      ensureUserIsAuthenticated,
      async (req, res: Response<LogUserOutResponse>) => {
        const { email } = req.user!;

        const result = await this.logUserOutUseCase.execute({ email });

        if (result.isFailure) {
          return res.status(400).json({
            success: false,
            exception:
              result.error instanceof Error ? result.error.message : result.error,
          });
        }

        return res.status(204).end();
      }
    );

    return this.router;
  }
}
