/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - id
 *         - firstName
 *         - lastName
 *         - email
 *       properties:
 *         id:
 *           type: string
 *           description: The ID of the user.
 *           format: uuid
 *           example: 123e4567-e89b-12d3-a456-426614174000
 *           nullable: false
 *         firstName:
 *           type: string
 *           description: The first name of the user.
 *           example: John
 *           nullable: false
 *           minLength: 2
 *         lastName:
 *           type: string
 *           description: The last name of the user.
 *           example: Doe
 *           nullable: false
 *           minLength: 2
 *         email:
 *           type: string
 *           description: The email of the user.
 *           format: email
 *           example: john@doe.com
 *           nullable: false
 */

import type { IJWTService } from "@auth/application/services/IJWTService";
import type { EmailExceptions } from "@auth/domain/value-objects/Email";
import type { FirstNameExceptions } from "@auth/domain/value-objects/FirstName";
import type { LastNameExceptions } from "@auth/domain/value-objects/LastName";
import type { PasswordExceptions } from "@auth/domain/value-objects/Password";
import type { UniqueEntityId } from "@shared/domain/models/UniqueEntityId";

import { container } from "tsyringe";

import { TokenType } from "@auth/application/services/IJWTService";
import { AUTH_TOKENS } from "@auth/di/tokens";
import { Email } from "@auth/domain/value-objects/Email";
import { FirstName } from "@auth/domain/value-objects/FirstName";
import { LastName } from "@auth/domain/value-objects/LastName";
import { Password } from "@auth/domain/value-objects/Password";
import { Result } from "@shared/common/Result";
import { Entity } from "@shared/domain/models/Entity";

type UserProps = {
  firstName: FirstName;
  lastName: LastName;
  email: Email;
  password: Password;
};

export type CreateUserProps = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export class User extends Entity<UserProps> {
  private _password: Password;
  public _refreshToken: string;

  private constructor(props: UserProps & { password: Password }, id?: UniqueEntityId) {
    super(props, id);
    const jwtService = container.resolve<IJWTService>(AUTH_TOKENS.JWTService);

    this._refreshToken = jwtService.sign(
      {
        email: props.email.props.value,
        sub: this.id.toString(),
      },
      TokenType.RefreshToken
    );
    this._password = props.password;
  }

  public get id() {
    return this._id;
  }

  public get email() {
    return this.props.email.props.value;
  }

  public get firstName() {
    return this.props.firstName.props.value;
  }

  public get lastName() {
    return this.props.lastName.props.value;
  }

  static create(
    props: CreateUserProps,
    id?: UniqueEntityId
  ): Result<
    User,
    FirstNameExceptions | LastNameExceptions | EmailExceptions | PasswordExceptions
  > {
    const firstNameResult = FirstName.create(props.firstName);
    const lastNameResult = LastName.create(props.lastName);
    const emailResult = Email.create(props.email);
    const passwordResult = Password.create(props.password);

    const result = Result.combine(
      firstNameResult,
      lastNameResult,
      emailResult,
      passwordResult
    );

    if (result.isFailure) {
      return Result.fail(result.error);
    }

    return Result.ok(
      new User(
        {
          firstName: firstNameResult.value,
          lastName: lastNameResult.value,
          email: emailResult.value,
          password: passwordResult.value,
        },
        id
      )
    );
  }
}