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

import { Identifier } from "./Identifier";

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
  static create(id?: string) {
    if (!id) return new UniqueEntityId(uuidV4());
    if (validate(id)) return new UniqueEntityId(id);
    throw new Error(`It seems like given id is not a UUID. Given: \`${id}\``);
  }
}
