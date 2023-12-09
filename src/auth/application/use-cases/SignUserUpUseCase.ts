import type { EmailExceptions } from "@auth/domain/value-objects/Email";
import type { FirstNameExceptions } from "@auth/domain/value-objects/FirstName";
import type { LastNameExceptions } from "@auth/domain/value-objects/LastName";
import type { PasswordExceptions } from "@auth/domain/value-objects/Password";
import type { IUseCase } from "@shared/domain/models/UseCase";

import { inject, injectable } from "tsyringe";

import { IJWTService, TokenType } from "@auth/application/services/IJWTService";
import { IUserReadRepository } from "@auth/application/services/IUserReadRepository";
import { IUserWriteRepository } from "@auth/application/services/IUserWriteRepository";
import { AuthServicesTokens } from "@auth/di/tokens";
import { User } from "@auth/domain/entities/User";
import { Result } from "@shared/common/Result";
import { UniqueEntityId } from "@shared/domain/models/UniqueEntityId";

export type SignUserUpRequest = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export type SignUserUpSuccessResponse = {
  accessToken: string;
  refreshToken: string;
};

export enum SignUserUpExceptions {
  UserAlreadyExists = "UserAlreadyExists",
}

export type SignUserUpResponse = Result<
  SignUserUpSuccessResponse,
  | EmailExceptions
  | PasswordExceptions
  | FirstNameExceptions
  | LastNameExceptions
  | SignUserUpExceptions
  | Error
>;

@injectable()
export class SignUserUpUseCase
  implements IUseCase<SignUserUpRequest, SignUserUpResponse>
{
  constructor(
    @inject(AuthServicesTokens.UserReadRepository)
    private userReadRepository: IUserReadRepository,
    @inject(AuthServicesTokens.JWTService) private jwtService: IJWTService,
    @inject(AuthServicesTokens.UserWriteRepository)
    private userWriteRepository: IUserWriteRepository
  ) {}

  async execute(request: SignUserUpRequest): Promise<SignUserUpResponse> {
    const userExistsResult = await this.ensureUserDoesNotExist(request.email);

    if (userExistsResult.isFailure) {
      return Result.fail(userExistsResult.error);
    }

    // User does not exist, so create a new user
    const userResult = this.buildUser(request);

    if (userResult.isFailure) {
      return Result.fail(userResult.error);
    }

    // Create tokens for the user
    const { accessToken, refreshToken } = this.generateTokens(
      userResult.value.id.toString(),
      userResult.value.email,
      userResult.value.props.refreshToken
    );

    // Save the user and the refresh token to the database
    const userSaved = await this.userWriteRepository.createUser(userResult.value);

    if (userSaved.isFailure) {
      return Result.fail(userSaved.error);
    }

    // Return the tokens
    return Result.ok({
      accessToken,
      refreshToken,
    });
  }

  private async ensureUserDoesNotExist(
    email: string
  ): Promise<Result<string, SignUserUpExceptions | EmailExceptions>> {
    // If the user already exists, return an error
    const userAlreadyExists = await this.userReadRepository.exists(email);

    if (userAlreadyExists.isFailure) {
      return Result.fail(userAlreadyExists.error);
    }

    if (userAlreadyExists.value) {
      return Result.fail(SignUserUpExceptions.UserAlreadyExists);
    }

    return Result.ok(email);
  }

  private buildUser(
    request: SignUserUpRequest
  ): Result<
    User,
    EmailExceptions | PasswordExceptions | FirstNameExceptions | LastNameExceptions
  > {
    const id = UniqueEntityId.create().value;

    const refreshToken = this.jwtService.sign(
      {
        sub: id.toString(),
        email: request.email,
      },
      TokenType.AccessToken
    );

    // User does not exist, so create a new user
    const userToCreate = User.create(
      {
        email: request.email,
        password: request.password,
        firstName: request.firstName,
        lastName: request.lastName,
        refreshToken: refreshToken,
      },
      id
    );

    // If the user could not be created, return an error
    if (userToCreate.isFailure) {
      return Result.fail(userToCreate.error);
    }

    return Result.ok(userToCreate.value);
  }

  private generateTokens(
    userId: string,
    userEmail: string,
    userRefreshToken: string
  ): SignUserUpSuccessResponse {
    const accessToken = this.jwtService.sign(
      {
        sub: userId,
        email: userEmail,
      },
      TokenType.AccessToken
    );

    const refreshToken = userRefreshToken;

    return {
      accessToken,
      refreshToken,
    };
  }
}
