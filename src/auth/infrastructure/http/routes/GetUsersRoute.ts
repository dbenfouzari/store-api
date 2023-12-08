import { Router } from "express";
import { inject, injectable } from "tsyringe";

import { GetAllUsers } from "@auth/application/use-cases/GetAllUsers";
import { AUTH_TOKENS } from "@auth/di/tokens";

type GetUsersSuccessResponse = {
  success: true;
  users: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  }[];
};

type GetUsersErrorResponse = {
  success: false;
  exception: string;
};

type GetUsersResponse = GetUsersSuccessResponse | GetUsersErrorResponse;

/**
 * @openapi
 * /users:
 *   get:
 *     tags: [User]
 *     summary: Get all users.
 *     description: |
 *       Get all users
 *     responses:
 *       200:
 *         $ref: "#/components/responses/UserListResponse"
 *       500:
 *         $ref: "#/components/responses/UnexpectedErrorResponse"
 */
@injectable()
export class GetUsersRoute {
  private router = Router();

  constructor(
    @inject(AUTH_TOKENS.GetAllUsersUseCase) private getAllUsersUseCase: GetAllUsers
  ) {}

  public register() {
    this.router.get<undefined, GetUsersResponse, undefined, undefined>(
      "/users",
      async (_req, res) => {
        const userResponse = await this.getAllUsersUseCase.execute();

        return userResponse.match(
          (exception) => {
            res.status(500).json({
              success: false,
              exception: exception.message,
            });
          },
          (userSet) => {
            const users = [...userSet.values()].map((user) => ({
              id: user.id.toString(),
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
            }));

            res.status(200).json({
              success: true,
              users,
            });
          }
        );
      }
    );

    return this.router;
  }
}
