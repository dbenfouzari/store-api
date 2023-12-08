import type { IUserReadRepository } from "@auth/application/services/IUserReadRepository";
import type { User } from "@auth/domain/entities/User";
import type { EmailExceptions } from "@auth/domain/value-objects/Email";

import { injectable } from "tsyringe";

import { Email } from "@auth/domain/value-objects/Email";
import { Option } from "@shared/common/Option";
import { Result } from "@shared/common/Result";
import { UniqueEntityId } from "@shared/domain/models/UniqueEntityId";

@injectable()
export class InMemoryUserReadRepository implements IUserReadRepository {
  private _users: Map<UniqueEntityId, User> = new Map();

  async exists(email: string): Promise<Result<boolean, EmailExceptions>> {
    const emailResult = Email.create(email);

    if (emailResult.isFailure) {
      return Result.fail(emailResult.error);
    }

    const usersByEmail = this.getUsersByEmail();
    const user = usersByEmail.get(emailResult.value);
    const exists = user !== undefined;
    return Promise.resolve(Result.ok(exists));
  }

  async getUserByEmail(email: string): Promise<Result<Option<User>, EmailExceptions>> {
    const emailExists = await this.exists(email);

    if (emailExists.isFailure) {
      return Result.fail(emailExists.error);
    }

    if (!emailExists.value) {
      return Promise.resolve(Result.ok(Option.none<User>()));
    }

    const emailValue = Email.create(email).value;

    const usersByEmail = this.getUsersByEmail();
    const user = usersByEmail.get(emailValue);
    return Result.ok(Option.from(user));
  }

  getUserById(id: string): Promise<Option<User>> {
    const userId = UniqueEntityId.create(id).value;

    const user = this._users.get(userId);
    return Promise.resolve(Option.from(user));
  }

  private getUsersByEmail(): Map<Email, User> {
    return [...this._users.entries()].reduce(
      (acc, [_, user]) => acc.set(user.props.email, user),
      new Map()
    );
  }
}
