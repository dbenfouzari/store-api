import type { SignUserUpExceptions } from "@auth/application/use-cases/SignUserUpUseCase";
import type { EmailExceptions } from "@auth/domain/value-objects/Email";
import type { FirstNameExceptions } from "@auth/domain/value-objects/FirstName";
import type { LastNameExceptions } from "@auth/domain/value-objects/LastName";
import type { PasswordExceptions } from "@auth/domain/value-objects/Password";

import { Router } from "express";
import { inject, injectable } from "tsyringe";

import { SignUserUpUseCase } from "@auth/application/use-cases/SignUserUpUseCase";
import { AuthUseCasesTokens } from "@auth/di/tokens";

/**
 * @openapi
 * components:
 *   requestBodies:
 *     SignUserUpRequest:
 *       description: Sign user up request.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of the user to be signed up.
 *                 example: john@doe.com
 *                 nullable: false
 *                 format: email
 *               password:
 *                 type: string
 *                 description: The password of the user to be signed up.
 *                 example: myComplexPassword123!
 *                 nullable: false
 *                 minLength: 8
 *                 pattern: ^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$ # Must have at least one number, one uppercase letter, one lowercase letter and one special character
 *               firstName:
 *                 type: string
 *                 description: The first name of the user to be signed up.
 *                 example: John
 *                 nullable: false
 *                 minLength: 2
 *               lastName:
 *                 type: string
 *                 description: The last name of the user to be signed up.
 *                 example: Doe
 *                 nullable: false
 *                 minLength: 2
 */
export type SignUserUpRequest = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

/**
 * @openapi
 * components:
 *   responses:
 *     SignUserUpSuccessResponse:
 *       description: Sign user up response.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - success
 *               - data
 *             properties:
 *               success:
 *                 type: boolean
 *                 description: Whether the request was successful.
 *                 example: true
 *                 nullable: false
 *                 enum: [true]
 *               data:
 *                 type: object
 *                 required:
 *                   - accessToken
 *                   - refreshToken
 *                 properties:
 *                   accessToken:
 *                     type: string
 *                     description: The access token.
 *                     example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     nullable: false
 *                     format: jwt
 *                   refreshToken:
 *                     type: string
 *                     description: The refresh token.
 *                     example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     nullable: false
 *                     format: jwt
 */
export type SignUserUpSuccessResponse = {
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
 *     SignUserUpErrorResponse:
 *       description: Sign user up response.
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
 *                 description: The exception that was thrown.
 *                 example: UserAlreadyExists
 *                 nullable: false
 *                 enum:
 *                   - UserAlreadyExists
 *                   - EmailTooShort
 *                   - EmailTooLong
 *                   - EmailInvalidFormat
 *                   - PasswordTooShort
 *                   - PasswordMustHaveAtLeastOneNumber
 *                   - PasswordMustHaveAtLeastOneUpperCaseLetter
 *                   - PasswordMustHaveAtLeastOneLowerCaseLetter
 *                   - PasswordMustHaveAtLeastOneSpecialCharacter
 *                   - FirstNameTooShort
 *                   - FirstNameTooLong
 *                   - LastNameTooShort
 *                   - LastNameTooLong
 *                   - SignUserUpException
 *                   - Error
 */
export type SignUserUpErrorResponse = {
  success: false;
  exception:
    | EmailExceptions
    | PasswordExceptions
    | FirstNameExceptions
    | LastNameExceptions
    | SignUserUpExceptions
    | Error;
};

export type SignUserUpResponse = SignUserUpSuccessResponse | SignUserUpErrorResponse;

/**
 * @openapi
 * /auth/sign-up:
 *   post:
 *     tags: [Auth]
 *     summary: Sign user up.
 *     description: |
 *       Signs user up.
 *
 *       **`email`** must be unique.
 *     requestBody:
 *       $ref: '#/components/requestBodies/SignUserUpRequest'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/SignUserUpSuccessResponse'
 *       400:
 *         $ref: '#/components/responses/SignUserUpErrorResponse'
 */
@injectable()
export class SignUserUpRoute {
  private router = Router();

  constructor(
    @inject(AuthUseCasesTokens.SignUserUpUseCase)
    private readonly signUserUpUseCase: SignUserUpUseCase
  ) {}

  public register() {
    this.router.post<undefined, SignUserUpResponse, SignUserUpRequest, undefined>(
      "/auth/sign-up",
      async (req, res) => {
        const result = await this.signUserUpUseCase.execute({
          email: req.body.email,
          password: req.body.password,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
        });

        if (result.isFailure) {
          return res.status(400).json({
            success: false,
            exception: result.error,
          });
        }

        return res.status(200).json({
          success: true,
          data: {
            accessToken: result.value.accessToken,
            refreshToken: result.value.refreshToken,
          },
        });
      }
    );

    return this.router;
  }
}
