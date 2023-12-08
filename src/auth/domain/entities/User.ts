import type { EmailExceptions } from "@auth/domain/value-objects/Email";
import type { FirstNameExceptions } from "@auth/domain/value-objects/FirstName";
import type { LastNameExceptions } from "@auth/domain/value-objects/LastName";
import type { PasswordExceptions } from "@auth/domain/value-objects/Password";
import type { UniqueEntityId } from "@shared/domain/models/UniqueEntityId";

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
};

export type CreateUserProps = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export class User extends Entity<UserProps> {
  private _password: Password;

  private constructor(props: UserProps & { password: Password }, id?: UniqueEntityId) {
    super(props, id);

    this._password = props.password;
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
