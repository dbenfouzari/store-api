import type { EmailExceptions } from "@auth/domain/value-objects/Email";
import type { IUseCase } from "@shared/domain/models/UseCase";

import { inject, injectable } from "tsyringe";

import { IUserReadRepository } from "@auth/application/services/IUserReadRepository";
import { IUserWriteRepository } from "@auth/application/services/IUserWriteRepository";
import { AuthServicesTokens } from "@auth/di/tokens";
import { Result } from "@shared/common/Result";

export type LogUserOutUseCaseRequest = {
  email: string;
};

export enum LogUserOutUseCaseErrors {
  UserNotFound = "User not found",
}

export type LogUserOutUseCaseResponse = Result<
  void,
  EmailExceptions | LogUserOutUseCaseErrors | Error
>;

@injectable()
export class LogUserOutUseCase
  implements IUseCase<LogUserOutUseCaseRequest, LogUserOutUseCaseResponse>
{
  constructor(
    @inject(AuthServicesTokens.UserReadRepository)
    private readonly userReadRepository: IUserReadRepository,
    @inject(AuthServicesTokens.UserWriteRepository)
    private readonly userWriteRepository: IUserWriteRepository
  ) {}

  async execute(request: LogUserOutUseCaseRequest): Promise<LogUserOutUseCaseResponse> {
    const userResult = await this.userReadRepository.getUserByEmail(request.email);

    if (userResult.isFailure) {
      return Result.fail(userResult.error);
    }

    const userOption = userResult.value;

    if (!userOption.isSome()) {
      return Result.fail(LogUserOutUseCaseErrors.UserNotFound);
    }

    const user = userOption.unwrap();

    user.logOut();

    const updatedUserResult = await this.userWriteRepository.updateUser(user);

    if (updatedUserResult.isFailure) {
      return Result.fail(updatedUserResult.error);
    }

    return Result.ok(undefined);
  }
}
