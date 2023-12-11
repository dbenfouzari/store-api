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

import type { EmailExceptions } from "@auth/domain/value-objects/Email";
import type { FirstNameExceptions } from "@auth/domain/value-objects/FirstName";
import type { LastNameExceptions } from "@auth/domain/value-objects/LastName";
import type { PasswordExceptions } from "@auth/domain/value-objects/Password";
import type { Result } from "@shared/common/Result";
import type { UniqueEntityId } from "@shared/domain/models/UniqueEntityId";

import { Email } from "@auth/domain/value-objects/Email";
import { FirstName } from "@auth/domain/value-objects/FirstName";
import { LastName } from "@auth/domain/value-objects/LastName";
import { Password } from "@auth/domain/value-objects/Password";
import { UserRole, UserRoles } from "@auth/domain/value-objects/UserRole";
import { Ok } from "@shared/common/Result";
import { Entity } from "@shared/domain/models/Entity";

type UserProps = {
  firstName: FirstName;
  lastName: LastName;
  email: Email;
  password: Password;
  role: UserRole;
  refreshToken?: string;
};

export type CreateUserProps = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: UserRoles;
  refreshToken?: string;
};

export class User extends Entity<UserProps> {
  public get id() {
    return this._id;
  }

  public get email() {
    return this.props.email.props.value;
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
    const roleResult = UserRole.create(props.role ?? UserRoles.USER);

    return firstNameResult.andThen((firstName) => {
      return lastNameResult.andThen((lastName) => {
        return emailResult.andThen((email) => {
          return passwordResult.andThen((password) => {
            return roleResult.andThen((role) => {
              return Ok.of(
                new User(
                  {
                    firstName,
                    lastName,
                    email,
                    password,
                    role,
                    refreshToken: props.refreshToken,
                  },
                  id
                )
              );
            });
          });
        });
      });
    });
  }

  public logOut() {
    this.props.refreshToken = undefined;
  }

  public logIn(refreshToken: string) {
    this.props.refreshToken = refreshToken;
  }
}
