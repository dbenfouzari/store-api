import type { IUserReadRepository } from "@auth/application/services/IUserReadRepository";
import type { EmailExceptions } from "@auth/domain/value-objects/Email";

import { injectable } from "tsyringe";

import { User } from "@auth/domain/entities/User";
import { Email } from "@auth/domain/value-objects/Email";
import { Option } from "@shared/common/Option";
import { Result } from "@shared/common/Result";
import { UniqueEntityId } from "@shared/domain/models/UniqueEntityId";

@injectable()
export class InMemoryUserReadRepository implements IUserReadRepository {
  private _users: Set<User> = new Set();

  constructor() {
    // Init with sample user
    const user = User.create({
      firstName: "John",
      lastName: "Doe",
      email: "john@doe.com",
      password: "myComplexPassword123!",
    }).value;

    this._users.add(user);
  }

  async exists(email: string): Promise<Result<boolean, EmailExceptions>> {
    const emailResult = Email.create(email);

    if (emailResult.isFailure) {
      return Result.fail(emailResult.error);
    }

    const user = [...this._users.values()].find((u) =>
      u.props.email.equals(emailResult.value)
    );

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

    const user = [...this._users.values()].find((user) =>
      user.props.email.equals(emailValue)
    );

    return Result.ok(Option.from(user));
  }

  getUserById(id: string): Promise<Option<User>> {
    const userId = UniqueEntityId.create(id).value;

    const user = [...this._users.values()].find((u) => u.id.equals(userId));
    return Promise.resolve(Option.from(user));
  }

  getAllUsers(): Promise<Set<User>> {
    return Promise.resolve(this._users);
  }
}
