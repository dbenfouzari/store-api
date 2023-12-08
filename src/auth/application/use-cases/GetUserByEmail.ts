import type { User } from "@auth/domain/entities/User";
import type { EmailExceptions } from "@auth/domain/value-objects/Email";
import type { Option } from "@shared/common/Option";
import type { Result } from "@shared/common/Result";
import type { IUseCase } from "@shared/domain/models/UseCase";

import { inject, injectable } from "tsyringe";

import { IUserReadRepository } from "@auth/application/services/IUserReadRepository";
import { AUTH_TOKENS } from "@auth/di/tokens";

type GetUserByEmailRequest = {
  email: string;
};

type GetUserByEmailResponse = Result<Option<User>, EmailExceptions>;

@injectable()
export class GetUserByEmail
  implements IUseCase<GetUserByEmailRequest, GetUserByEmailResponse>
{
  constructor(
    @inject(AUTH_TOKENS.UserReadRepository)
    private readonly _userReadRepository: IUserReadRepository
  ) {}

  async execute(request: GetUserByEmailRequest): Promise<GetUserByEmailResponse> {
    return await this._userReadRepository.getUserByEmail(request.email);
  }
}
