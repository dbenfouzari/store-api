import type { Result } from "@shared/common/Result";

import { Err, Ok } from "@shared/common/Result";
import { ValueObject } from "@shared/domain/models/ValueObject";

export enum UserRoles {
  ADMIN = "admin",
  USER = "user",
}

type UserRoleProps = {
  value: UserRoles;
};

export class UserRole extends ValueObject<UserRoleProps> {
  public static create(role: UserRoles): Result<UserRole, Error> {
    if (!Object.values(UserRoles).includes(role)) {
      return Err.of(new Error("Invalid user role provided"));
    }

    return Ok.of(new UserRole({ value: role }));
  }

  // noinspection JSUnusedGlobalSymbols
  public static admin(): UserRole {
    return new UserRole({ value: UserRoles.ADMIN });
  }

  public static user(): UserRole {
    return new UserRole({ value: UserRoles.USER });
  }
}
