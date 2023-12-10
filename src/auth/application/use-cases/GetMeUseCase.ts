import type { User } from "@auth/domain/entities/User";
import type { Result } from "@shared/common/Result";
import type { IUseCase } from "@shared/domain/models/UseCase";

import { inject, injectable } from "tsyringe";

import { IJWTService, TokenType } from "@auth/application/services/IJWTService";
import { IUserReadRepository } from "@auth/application/services/IUserReadRepository";
import { AuthServicesTokens } from "@auth/di/tokens";
import { Err, Ok } from "@shared/common/Result";

type GetMeRequest = {
  token: string;
};

type GetMeResponse = Result<User, GetMeException>;

enum GetMeException {
  UserNotFound = "UserNotFound",
}

@injectable()
export class GetMeUseCase implements IUseCase<GetMeRequest, GetMeResponse> {
  constructor(
    @inject(AuthServicesTokens.UserReadRepository)
    private readonly userReadRepository: IUserReadRepository,
    @inject(AuthServicesTokens.JWTService)
    private readonly jwtService: IJWTService
  ) {}

  async execute(request: GetMeRequest): Promise<GetMeResponse> {
    const maybeTokenPayload = this.jwtService.verify(
      request.token,
      TokenType.AccessToken
    );

    if (!maybeTokenPayload) {
      return Err.of(GetMeException.UserNotFound);
    }

    const user = await this.userReadRepository.getUserByEmail(
      maybeTokenPayload.unwrap().email
    );

    return user.match(
      (maybeUser) => {
        return maybeUser.match(
          (user) => Ok.of(user),
          () => Err.of(GetMeException.UserNotFound)
        );
      },
      () => Err.of(GetMeException.UserNotFound)
    );
  }
}
