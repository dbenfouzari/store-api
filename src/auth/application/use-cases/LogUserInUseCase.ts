import type { IUseCase } from "@shared/application/IUseCase";
import type { Result } from "@shared/common/Result";

import { inject, injectable } from "tsyringe";

import { IJWTService, TokenType } from "@auth/application/services/IJWTService";
import { IUserReadRepository } from "@auth/application/services/IUserReadRepository";
import { IUserWriteRepository } from "@auth/application/services/IUserWriteRepository";
import { AuthServicesTokens } from "@auth/di/tokens";
import { Err, Ok } from "@shared/common/Result";

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
      (maybeUser) => {
        return maybeUser.match(
          (user) => {
            if (user.props.password.props.value !== request.password) {
              return Err.of(LogUserInException.InvalidPassword);
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

            return Ok.of({
              accessToken: accessToken,
              refreshToken: refreshToken,
            });
          },
          () => Err.of(LogUserInException.UserNotFound)
        );
      },
      () => Err.of(LogUserInException.UserNotFound)
    );
  }
}
