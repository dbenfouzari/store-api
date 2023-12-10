import type { Response } from "express";

import { Router } from "express";
import { inject, injectable } from "tsyringe";

import { GetMeUseCase } from "@auth/application/use-cases/GetMeUseCase";
import { AuthUseCasesTokens } from "@auth/di/tokens";
import { ensureUserIsAuthenticated } from "@auth/infrastructure/http/middlewares/ensureUserIsAuthenticated";

/**
 * @openapi
 * components:
 *   responses:
 *     GetMeSuccessResponse:
 *       description: Success response.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - success
 *               - me
 *             properties:
 *               success:
 *                 type: boolean
 *                 example: true
 *                 description: Indicates if the request was successful.
 *                 nullable: false
 *                 enum: [true]
 *               me:
 *                 type: object
 *                 required:
 *                   - id
 *                   - email
 *                   - firstName
 *                   - lastName
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: uuid
 *                     example: 123e4567-e89b-12d3-a456-426614174000
 *                     description: The user's id.
 *                     nullable: false
 *                   email:
 *                     type: string
 *                     format: email
 *                     example: john@doe.com
 *                     description: The user's email.
 *                     nullable: false
 *                   firstName:
 *                     type: string
 *                     example: John
 *                     description: The user's first name.
 *                     nullable: false
 *                   lastName:
 *                     type: string
 *                     example: Doe
 *                     description: The user's last name.
 *                     nullable: false
 */
type GetMeSuccessResponse = {
  success: true;
  me: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
};

/**
 * @openapi
 * components:
 *   responses:
 *     GetMeErrorResponse:
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
 *                 example: false
 *                 description: Indicates if the request was successful.
 *                 nullable: false
 *                 enum: [false]
 *                 default: false
 *               exception:
 *                 type: string
 *                 example: Unauthorized
 *                 description: The exception message.
 *                 nullable: false
 */
type GetMeErrorResponse = {
  success: false;
  exception: string;
};

type GetMeResponse = GetMeSuccessResponse | GetMeErrorResponse;

/**
 * @openapi
 * /auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Get the current user.
 *     security:
 *       - BearerAuth: []
 *     description: |
 *       Get the current user.
 *
 *       This endpoint requires authentication and uses headers JWT token.
 *     responses:
 *       200:
 *         $ref: '#/components/responses/GetMeSuccessResponse'
 *       401:
 *         $ref: '#/components/responses/GetMeErrorResponse'
 */
@injectable()
export class GetMeRoute {
  private router = Router();

  constructor(
    @inject(AuthUseCasesTokens.GetMeUseCase) private getMeUseCase: GetMeUseCase
  ) {}

  public register() {
    //  Request<ParamsDictionary, GetMeResponse, any, QueryString.ParsedQs, Record<string, any>>
    this.router.get(
      "/auth/me",
      ensureUserIsAuthenticated,
      async (req, res: Response<GetMeResponse>) => {
        const user = req.user;

        if (!user) {
          return res.status(401).json({
            success: false,
            exception: "Unauthorized",
          });
        }

        const result = await this.getMeUseCase.execute({
          token: req.headers.authorization?.split(" ")[1] ?? "",
        });

        return result.match(
          (user) => {
            return res.status(200).json({
              success: true,
              me: {
                id: user.id.toString(),
                email: user.props.email.props.value,
                firstName: user.props.firstName.props.value,
                lastName: user.props.lastName.props.value,
              },
            });
          },
          (exception) => {
            return res.status(401).json({
              success: false,
              exception,
            });
          }
        );
      }
    );

    return this.router;
  }
}
