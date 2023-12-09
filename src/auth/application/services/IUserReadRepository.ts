import type { User } from "@auth/domain/entities/User";
import type { EmailExceptions } from "@auth/domain/value-objects/Email";
import type { Option } from "@shared/common/Option";
import type { Result } from "@shared/common/Result";

export interface IUserReadRepository {
  getAllUsers(): Promise<User[]>;
  exists(email: string): Promise<Result<boolean, EmailExceptions>>;
  getUserByEmail(email: string): Promise<Result<Option<User>, EmailExceptions>>;
  getUserById(id: string): Promise<Option<User>>;
}
