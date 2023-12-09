import type { IUseCase } from "@shared/domain/models/UseCase";

import { inject, injectable } from "tsyringe";

import { IJWTService, TokenType } from "@auth/application/services/IJWTService";
import { IUserReadRepository } from "@auth/application/services/IUserReadRepository";
import { AuthServicesTokens } from "@auth/di/tokens";
import { Result } from "@shared/common/Result";

export interface RefreshUserTokenRequest {
  refreshToken: string;
}

export interface RefreshUserTokenSuccessResponse {
  accessToken: string;
}

export enum RefreshUserTokenException {
  INVALID_REFRESH_TOKEN = "INVALID_REFRESH_TOKEN",
}

@injectable()
export class RefreshUserTokenUseCase
  implements
    IUseCase<
      RefreshUserTokenRequest,
      Result<RefreshUserTokenSuccessResponse, RefreshUserTokenException>
    >
{
  constructor(
    @inject(AuthServicesTokens.JWTService) private jwtService: IJWTService,
    @inject(AuthServicesTokens.UserReadRepository)
    private userReadRepository: IUserReadRepository
  ) {}

  async execute(
    request: RefreshUserTokenRequest
  ): Promise<Result<RefreshUserTokenSuccessResponse, RefreshUserTokenException>> {
    const decodedToken = this.jwtService.verify(
      request.refreshToken,
      TokenType.RefreshToken
    );

    if (!decodedToken.isSome()) {
      return Result.fail(RefreshUserTokenException.INVALID_REFRESH_TOKEN);
    }

    const user = await this.userReadRepository.getUserByEmail(
      decodedToken.unwrap().email
    );

    if (user.isFailure) {
      return Result.fail(RefreshUserTokenException.INVALID_REFRESH_TOKEN);
    }

    const accessToken = this.jwtService.sign(
      {
        email: user.value.unwrap().email,
        sub: user.value.unwrap().id.toString(),
      },
      TokenType.AccessToken
    );

    return Result.ok({
      accessToken,
    });
  }
}
