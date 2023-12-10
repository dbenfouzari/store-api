import { Formatter } from "@shared/common/Formatter";

import { UniqueEntityId } from "./UniqueEntityId";

/**
 * Entity type comparator
 * @param maybeEntity Entity to check
 * @returns True if value is an Entity instance, false otherwise.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isEntity(maybeEntity: any): maybeEntity is Entity<any> {
  return maybeEntity instanceof Entity;
}

/**
 * Entity class implementation
 *
 * Entities should be the first place that we think of to put
 * domain logic when we want to express what a particular model,
 * - can do,
 * - when it can do it,
 * - what conditions dictate when it can do that thing.
 *
 * Use Entity to entities to enforce model invariants
 */
export abstract class Entity<T> {
  /**
   * The id of the entity and it's readonly since it
   * should not be able to change after instantiated
   */
  protected readonly _id: UniqueEntityId;

  /**
   * The props of the entity class are stored in this.props
   * to leave to the subclass to decide getters and setters
   */
  public readonly props: T;

  /**
   * Creates a new Entity instance
   * @param props The entity props
   * @param id The entity ID. If not given, one will be generated.
   */
  protected constructor(props: T, id?: UniqueEntityId) {
    this._id = id ?? UniqueEntityId.create().unwrap();
    this.props = props;
  }

  /**
   * Equal comparator based on referential equality
   * @param other Entity object to compare
   * @returns True if entities are equal, false otherwise
   */
  public equals(other: Entity<T> | null | undefined): boolean {
    if (other === null || other === undefined) return false;

    if (this === other) return true;

    if (!isEntity(other)) return false;

    return this._id.equals(other._id);
  }

  public toString() {
    const constructorName = this.constructor.name;

    if (isObject(this.props)) {
      const joined = Object.entries(this.props)
        .map(([key, value]) => {
          return `${key}: ${Formatter.toStringDebug(value)}`;
        })
        .join(", ");

      return `${constructorName} (${joined})`;
    }

    return constructorName;
  }
}

/**
 * Check if value is an object
 * @param t The value to check against
 * @returns True if is considered as an object, false otherwise.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isObject(t: any): t is Record<string, unknown> {
  if (Array.isArray(t)) return false;
  if (typeof t === "string" || typeof t === "number") return false;
  if (t === null || t === undefined) return false;
  if (t instanceof Date) return false;

  return true;
}
