import type { IUseCase } from "@shared/domain/models/UseCase";

import { inject, injectable } from "tsyringe";

import { IJWTService, TokenType } from "@auth/application/services/IJWTService";
import { IUserReadRepository } from "@auth/application/services/IUserReadRepository";
import { IUserWriteRepository } from "@auth/application/services/IUserWriteRepository";
import { AuthServicesTokens } from "@auth/di/tokens";
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
    @inject(AuthServicesTokens.UserReadRepository)
    private readonly userReadRepository: IUserReadRepository,
    @inject(AuthServicesTokens.UserWriteRepository)
    private readonly userWriteRepository: IUserWriteRepository,
    @inject(AuthServicesTokens.JWTService)
    private readonly jwtService: IJWTService
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

            const accessToken = this.jwtService.sign(
              {
                email: user.props.email.props.value,
                sub: user.id.toString(),
              },
              TokenType.AccessToken
            );

            const refreshToken = this.jwtService.sign(
              {
                email: user.props.email.props.value,
                sub: user.id.toString(),
              },
              TokenType.RefreshToken
            );

            user.logIn(refreshToken);

            this.userWriteRepository.updateUser(user);

            return Result.ok({
              accessToken: accessToken,
              refreshToken: refreshToken,
            });
          },
          () => Result.fail(LogUserInException.UserNotFound)
        );
      }
    );
  }
}
