import type { IUserReadRepository } from "@auth/application/services/IUserReadRepository";
import type { IUserWriteRepository } from "@auth/application/services/IUserWriteRepository";
import type { EmailExceptions } from "@auth/domain/value-objects/Email";
import type { UserRoles } from "@auth/domain/value-objects/UserRole";
import type { Option } from "@shared/common/Option";
import type { Result } from "@shared/common/Result";

import fs from "fs";
import path from "path";

import { inject, injectable } from "tsyringe";

import { User } from "@auth/domain/entities/User";
import { IAppLogger } from "@shared/application/IAppLogger";
import { None, Some } from "@shared/common/Option";
import { Ok } from "@shared/common/Result";
import { SharedTokens } from "@shared/di/tokens";
import { UniqueEntityId } from "@shared/domain/models/UniqueEntityId";

type UserJson = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  refreshToken?: string;
};

/**
 * Map User entity to JSON data.
 * @param user User entity
 * @returns User JSON data
 */
function mapUserToData(user: User): UserJson {
  return {
    id: user.id.toString(),
    firstName: user.props.firstName.props.value,
    lastName: user.props.lastName.props.value,
    email: user.props.email.props.value,
    password: user.props.password.props.value,
    role: user.props.role.props.value,
    refreshToken: user.props.refreshToken,
  };
}

@injectable()
export class FileUserRepository implements IUserReadRepository, IUserWriteRepository {
  // File path is located in the root folder, `data/users.json`
  private readonly filePath = path.join(__dirname, "../../../../data/users.json");

  constructor(@inject(SharedTokens.AppLogger) private readonly logger: IAppLogger) {}

  createUser(user: User): Promise<Result<User, Error>> {
    this.logger.trace("FileUserRepository.createUser.impl", { user });

    const users = this.readFile();
    const nextUsers = [...users, user];

    fs.writeFileSync(
      this.filePath,
      JSON.stringify(nextUsers.map(mapUserToData), null, 2)
    );
    return Promise.resolve(Ok.of(user));
  }

  async exists(email: string): Promise<Result<boolean, EmailExceptions>> {
    this.logger.trace("FileUserRepository.exists.impl", { email });

    const users = this.readFile();
    const user = [...users.values()].find((u) => u.props.email.props.value === email);
    const exists = user !== undefined;

    return Promise.resolve(Ok.of(exists));
  }

  getAllUsers(): Promise<User[]> {
    this.logger.trace("FileUserRepository.getAllUsers.impl");

    const users = this.readFile();
    return Promise.resolve(users);
  }

  getUserByEmail(email: string): Promise<Result<Option<User>, EmailExceptions>> {
    this.logger.trace("FileUserRepository.getUserByEmail.impl", { email });

    const users = this.readFile();
    const user = [...users.values()].find((u) => u.props.email.props.value === email);

    if (user === undefined) {
      return Promise.resolve(Ok.of(new None()));
    }

    return Promise.resolve(Ok.of(Some.of(user)));
  }

  getUserById(id: string): Promise<Option<User>> {
    this.logger.trace("FileUserRepository.getUserById.impl", { id });

    const users = this.readFile();
    const user = users.find((u) => u.id.toString() === id);

    if (user === undefined) {
      return Promise.resolve(new None());
    }

    return Promise.resolve(Some.of(user));
  }

  private readFile(): User[] {
    const file = fs.readFileSync(this.filePath, { encoding: "utf-8" });
    const usersJson = JSON.parse(file) as UserJson[];
    return usersJson.map((user) => {
      return User.create(
        {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          password: user.password,
          role: user.role as UserRoles,
          refreshToken: user.refreshToken,
        },
        UniqueEntityId.create(user.id).unwrap()
      ).unwrap();
    });
  }

  updateUser(user: User): Promise<Result<User, Error>> {
    this.logger.trace("FileUserRepository.updateUser.impl", { user });

    const users = this.readFile();

    const nextUsers = users.map((u) => {
      if (u.id.toString() === user.id.toString()) {
        return user;
      }

      return u;
    });

    fs.writeFileSync(
      this.filePath,
      JSON.stringify(nextUsers.map(mapUserToData), null, 2)
    );

    return Promise.resolve(Ok.of(user));
  }
}
