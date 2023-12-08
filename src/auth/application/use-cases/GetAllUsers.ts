import type { User } from "@auth/domain/entities/User";
import type { IUseCase } from "@shared/domain/models/UseCase";

import { inject, injectable } from "tsyringe";

import { IUserReadRepository } from "@auth/application/services/IUserReadRepository";
import { AUTH_TOKENS } from "@auth/di/tokens";
import { Result } from "@shared/common/Result";

type GetAllUsersResponse = Result<Set<User>, Error>;

@injectable()
export class GetAllUsers implements IUseCase<undefined, GetAllUsersResponse> {
  constructor(
    @inject(AUTH_TOKENS.UserReadRepository)
    private userReadRepository: IUserReadRepository
  ) {}

  async execute(): Promise<GetAllUsersResponse> {
    const users = await this.userReadRepository.getAllUsers();

    return Result.ok(users);
  }
}
