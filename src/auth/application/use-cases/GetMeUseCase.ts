import type { User } from "@auth/domain/entities/User";
import type { IUseCase } from "@shared/domain/models/UseCase";

import { inject, injectable } from "tsyringe";

import { IJWTService } from "@auth/application/services/IJWTService";
import { IUserReadRepository } from "@auth/application/services/IUserReadRepository";
import { AUTH_TOKENS } from "@auth/di/tokens";
import { Result } from "@shared/common/Result";

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
    @inject(AUTH_TOKENS.UserReadRepository)
    private readonly userReadRepository: IUserReadRepository,
    @inject(AUTH_TOKENS.JWTService)
    private readonly jwtService: IJWTService<{ email: string }>
  ) {}

  async execute(request: GetMeRequest): Promise<GetMeResponse> {
    const verifiedEmail = this.jwtService.verify(request.token);

    if (!verifiedEmail) {
      return Result.fail(GetMeException.UserNotFound);
    }

    const user = await this.userReadRepository.getUserByEmail(
      verifiedEmail.unwrap().email
    );

    return user.match(
      () => Result.fail(GetMeException.UserNotFound),
      (maybeUser) => {
        return maybeUser.match(
          (user) => Result.ok(user),
          () => Result.fail(GetMeException.UserNotFound)
        );
      }
    );
  }
}
