import type { UniqueEntityId } from "@shared/domain/models/UniqueEntityId";

import { Entity } from "@shared/domain/models/Entity";

/**
 * Aggregate Roots
 * An aggregate root is a developer's trust unit.
 *
 * It's an entity aimed to shield its "sub-entities", particularly business rules managing the entity's
 * various states.
 *
 * This root represents a business concept, expressible through classes.
 *
 * Initially, aggregates in DDD seemed daunting, but they're functionally straightforward.
 *
 * A root operates on the principle that only one entity from our module interacts with others; it's our
 * domain objects' usage entry point in the module.
 * In DDD, an aggregate root handles a single transactional issue.
 *
 * The benefit of concealing the entity's relationships is that the root retains behavior management,
 * controlling its "children" exclusively.
 */
export abstract class AggregateRoot<T> extends Entity<T> {
  protected constructor(props: T, id: UniqueEntityId) {
    super(props, id);
  }
}
