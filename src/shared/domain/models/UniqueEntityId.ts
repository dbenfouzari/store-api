/**
 * Being able to create Domain Entity Objects without having to rely on a db configuration
 * is desirable because it means that our unit tests can run really quickly, and
 * it's a good idea to separate concerns between creating objects and persisting objects.
 *
 * This technique also simplifies how we can use Domain Events to allow other subdomains
 * and bounded contexts to react to changes in our systems.
 *
 * A typical example:
 * Create an entity (like User) by calling User.create(props: UserProps).
 * When the entity is created, a unique UUID is assigned to it.
 * Pass the entity to a UserRepository.
 * The UserRepository uses a Mapper to structure the entity into the JSON object needed for the
 * ORM to save it to the database (like `UserMap.toSequelizeProps(user: User): any` or `UserMap.toTypeORM(user: User): any`,
 * including the UUID used for the primary key field
 */

import { v4 as uuidV4, validate } from "uuid";

import { Result } from "@shared/common/Result";

import { Identifier } from "./Identifier";

export enum UniqueEntityIdExceptions {
  NotValidUUID = "UniqueEntityIdNotValidUUID",
}

/**
 * Implements generation of unique identifier
 */
export class UniqueEntityId extends Identifier<string> {
  private constructor(id: string) {
    super(id);
  }

  /**
   * Create a unique entity ID.
   * @param id Entity ID. If not given, one will be created and assigned.
   * @returns A unique entity ID.
   */
  static create(
    id?: string | UniqueEntityId
  ): Result<UniqueEntityId, UniqueEntityIdExceptions> {
    if (!id) {
      return Result.ok(new UniqueEntityId(uuidV4()));
    }

    if (id instanceof UniqueEntityId) {
      return Result.ok(id);
    }

    if (validate(id)) {
      return Result.ok(new UniqueEntityId(id));
    }

    return Result.fail(UniqueEntityIdExceptions.NotValidUUID);
  }
}
