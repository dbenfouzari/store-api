import type { IUseCase } from "@shared/domain/models/UseCase";

import { inject, injectable } from "tsyringe";

import { IUserReadRepository } from "@auth/application/services/IUserReadRepository";
import { AUTH_TOKENS } from "@auth/di/tokens";
import { Result } from "@shared/common/Result";

export interface LogUserInRequest {
  email: string;
  password: string;
}

export interface LogUserInResponse {
  accessToken: string;
  refreshToken: string;
}

export enum LogUserInException {
  UserNotFound = "UserNotFound",
  InvalidPassword = "InvalidPassword",
}

@injectable()
export class LogUserInUseCase
  implements IUseCase<LogUserInRequest, Result<LogUserInResponse, LogUserInException>>
{
  constructor(
    @inject(AUTH_TOKENS.UserReadRepository)
    private readonly userReadRepository: IUserReadRepository
  ) {}

  async execute(
    request: LogUserInRequest
  ): Promise<Result<LogUserInResponse, LogUserInException>> {
    const user = await this.userReadRepository.getUserByEmail(request.email);

    return user.match(
      () => Result.fail(LogUserInException.UserNotFound),
      (maybeUser) => {
        return maybeUser.match(
          (user) => {
            if (user.props.password.props.value !== request.password) {
              return Result.fail(LogUserInException.InvalidPassword);
            }

            return Result.ok({
              accessToken: "access-token",
              refreshToken: "refresh-token",
            });
          },
          () => Result.fail(LogUserInException.UserNotFound)
        );
      }
    );
  }
}
