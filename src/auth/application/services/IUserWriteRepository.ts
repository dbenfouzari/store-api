import type { User } from "@auth/domain/entities/User";
import type { Result } from "@shared/common/Result";

export interface IUserWriteRepository {
  createUser(user: User): Promise<Result<User, Error>>;
}
