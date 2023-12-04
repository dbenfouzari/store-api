/**
 * The above "exceptions" or "errors" aren't really exceptions or errors at all. They are outcomes.
 * They are predictable, reasonable parts of our system.
 * My heuristic is, if they are something a good product manager would care about, they are not exceptions,
 * and you shouldn't throw them!
 *
 * Exceptions are unpredictable things we cannot reasonably plan for,
 * that the system should not attempt recovery from, and we should not route to the user.
 *
 * The convention is that left is used for failure cases and the right hand side is used for success cases.
 * The reason is actually that "right" is a pun or synonym for correct.
 */

/**
 * Basically means that this should be considered as a `red` path, i.e. an "exception",
 * something that should not happen.
 */
class Left<L, R> {
  constructor(readonly value: L) {}

  getIsLeft(): this is Left<L, R> {
    return true;
  }

  getIsRight(): this is Right<L, R> {
    return false;
  }
}

/**
 * Basically means that this should be considered as a `green` path.
 * It may contain the response.
 */
class Right<L, R> {
  constructor(readonly value: R) {}

  getIsLeft(): this is Left<L, R> {
    return false;
  }

  getIsRight(): this is Right<L, R> {
    return true;
  }
}

export type Either<L, R> = Left<L, R> | Right<L, R>;

/**
 * Create a Left class instance.
 * @param l Prop constructor
 * @returns A new Left instance.
 */
export function left<L, R>(l: L): Either<L, R> {
  return new Left<L, R>(l);
}

/**
 * Create a Right class instance.
 * @param r Prop constructor
 * @returns A new Right instance.
 */
export function right<L, R>(r: R): Either<L, R> {
  return new Right<L, R>(r);
}
