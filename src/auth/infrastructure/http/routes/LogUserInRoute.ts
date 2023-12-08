import { Router } from "express";
import { inject, injectable } from "tsyringe";

import {
  LogUserInException,
  LogUserInUseCase,
} from "@auth/application/use-cases/LogUserInUseCase";
import { AUTH_TOKENS } from "@auth/di/tokens";

/**
 * @openapi
 * components:
 *   requestBodies:
 *     LogUserInRequest:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: john@doe.com
 *           description: The user's email.
 *         password:
 *           type: string
 *           format: password
 *           example: myComplexPassword123!
 *           description: The user's password.
 *           minLength: 8
 *           maxLength: 32
 *           pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,32})"
 *       required:
 *         - email
 *         - password
 */
type LogUserInRequest = {
  email: string;
  password: string;
};

/**
 * @openapi
 * components:
 *   responses:
 *     LogUserInResponse:
 *       description: The user's access token and refresh token.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               success:
 *                 type: boolean
 *                 example: true
 *                 description: Whether the request was successful.
 *                 nullable: false
 *                 default: true
 *                 enum: [true]
 *               data:
 *                 type: object
 *                 properties:
 *                   accessToken:
 *                     type: string
 *                     example: access-token
 *                     description: The user's access token.
 *                     nullable: false
 *                   refreshToken:
 *                     type: string
 *                     example: refresh-token
 *                     description: The user's refresh token.
 *                     nullable: false
 */
type LogUserInSuccessResponse = {
  success: true;
  data: {
    accessToken: string;
    refreshToken: string;
  };
};

/**
 * @openapi
 * components:
 *   responses:
 *     LogUserInUserNotFoundErrorResponse:
 *       description: User could not be found.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               success:
 *                 type: boolean
 *                 example: false
 *                 description: Whether the request was successful.
 *                 nullable: false
 *                 default: false
 *                 enum: [false]
 *               exception:
 *                 type: string
 *                 example: "User not found."
 *                 description: The exception message.
 *                 nullable: false
 */
type LogUserInUserNotFoundErrorResponse = {
  success: false;
  exception: LogUserInException.UserNotFound;
};

/**
 * @openapi
 * components:
 *   responses:
 *     LogUserInInvalidPasswordErrorResponse:
 *       description: Password in incorrect.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               success:
 *                 type: boolean
 *                 example: false
 *                 description: Whether the request was successful.
 *                 nullable: false
 *                 default: false
 *                 enum: [false]
 *               exception:
 *                 type: string
 *                 example: "Invalid password."
 *                 description: The exception message.
 *                 nullable: false
 */
type LogUserInInvalidPasswordErrorResponse = {
  success: false;
  exception: LogUserInException.InvalidPassword;
};

type LogUserInResponse =
  | LogUserInSuccessResponse
  | LogUserInUserNotFoundErrorResponse
  | LogUserInInvalidPasswordErrorResponse;

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Log user in.
 *     description: |
 *       Allows a user to log in.
 *
 *       This endpoint returns an access token and a refresh token.
 *     requestBody:
 *       description: |
 *         The user's credentials.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/requestBodies/LogUserInRequest"
 *     responses:
 *       200:
 *         $ref: "#/components/responses/LogUserInResponse"
 *       404:
 *         $ref: "#/components/responses/LogUserInUserNotFoundErrorResponse"
 *       400:
 *         $ref: "#/components/responses/LogUserInInvalidPasswordErrorResponse"
 *       500:
 *         $ref: "#/components/responses/UnexpectedErrorResponse"
 */
@injectable()
export class LogUserInRoute {
  private router = Router();

  constructor(
    @inject(AUTH_TOKENS.LogUserInUseCase) private logUserInUseCase: LogUserInUseCase
  ) {}

  public register() {
    this.router.post<undefined, LogUserInResponse, LogUserInRequest, undefined>(
      "/auth/login",
      async (req, res) => {
        const logUserInResponse = await this.logUserInUseCase.execute({
          email: req.body.email,
          password: req.body.password,
        });

        return logUserInResponse.match(
          (exception) => {
            if (exception === LogUserInException.UserNotFound) {
              return res.status(404).json({
                success: false,
                exception: exception,
              });
            }

            return res.status(400).json({
              success: false,
              exception: exception,
            });
          },
          (data) => {
            return res.status(200).json({
              success: true,
              data: data,
            });
          }
        );
      }
    );

    return this.router;
  }
}
