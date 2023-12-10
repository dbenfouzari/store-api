import type { Option } from "@shared/common/Option";

import { None, Some } from "@shared/common/Option";

export abstract class Either<L, R> {
  /**
   * Apply one of two functions depending on contents,
   * unifying their result.
   *
   * If the value is **Left<L>** then the first function `leftFn` is applied;
   * if it is **Right<R>** then the second function `rightFn` is applied.
   *
   * ### Examples
   * @example
   * const square = (x: number) => x * x;
   * const negate = (x: number) => -x;
   *
   * const left = Left.from(4);
   * expect(left.either(square, negate)).toBe(16);
   *
   * const right = Right.from(-4);
   * expect(right.either(square, negate)).toBe(4);
   * @param leftFn The function to apply if the value is **Left<L>**.
   * @param rightFn The function to apply if the value is **Right<R>**.
   * @returns The result of the application.
   */
  abstract either<T>(leftFn: (left: L) => T, rightFn: (right: R) => T): T;
  /**
   * Convert **Either<L, R>** to **Either<R, L>**.
   *
   * ### Examples
   * @example
   * const left = Left.from("left");
   * expect(left.flip()).toEqual(Right.from("left"));
   *
   * const right = Right.from("right");
   * expect(right.flip()).toEqual(Left.from("right"));
   * @returns The converted value.
   */
  abstract flip(): Either<R, L>;
  /**
   * Returns true if the value is **Left** variant.
   *
   * ### Examples
   * @example
   * const left = Left.from("left");
   * const right = Right.from("right");
   *
   * expect(left.isLeft()).toBe(true);
   * expect(right.isLeft()).toBe(false);
   * @returns The result of the check.
   */
  abstract isLeft(): this is Left<L, R>;
  /**
   * Returns true if the value is **Right** variant.
   *
   * ### Examples
   * @example
   * const left = Left.from("left");
   * const right = Right.from("right");
   *
   * expect(left.isRight()).toBe(false);
   * expect(right.isRight()).toBe(true);
   * @returns The result of the check.
   */
  abstract isRight(): this is Right<L, R>;
  /**
   * Convert the left side of **Either<L, R>** to an **Option<L>**.
   *
   * ### Examples
   * @example
   *
   * const left = Left.from("left");
   * expect(left.left()).toEqual(Some.of("left"));
   *
   * const right = Right.from("right");
   * expect(right.left()).toEqual(new None());
   * @returns The converted value.
   */
  abstract left(): Option<L>;

  /**
   * Map `fn` over the contained value and return the result in the corresponding variant.
   *
   * ### Examples
   * @example
   * const value = Right.from(42);
   * const other = value.map((x) => x * 2);
   * expect(other).toEqual(Right.from(84));
   * @param fn The function to apply.
   * @returns The mapped value.
   */
  abstract map<T>(fn: (value: L | R) => T): Either<T, T>;
  /**
   * Apply the functions `leftFn` and `rightFn` to the **Left** and **Right** variants
   * respectively.
   *
   * ### Examples
   * @example
   *
   * const leftFn = (s: string) => s.length;
   * const rightFn = (n: number) => n.toString();
   *
   * const left = Left.from("loopy");
   * expect(left.mapEither(leftFn, rightFn)).toEqual(Left.from(5));
   *
   * const right = Right.from(42);
   * expect(right.mapEither(leftFn, rightFn)).toEqual(Right.from("42"));
   * @param leftFn The function to apply to the **Left** variant.
   * @param rightFn The function to apply to the **Right** variant.
   * @returns The result of the application.
   */
  abstract mapEither<T, U>(
    leftFn: (left: L) => T,
    rightFn: (right: R) => U
  ): Either<T, U>;
  /**
   * Apply the function `fn` on the value in the **Left** variant if it is present,
   * rewriting the result in **Left**.
   *
   * ### Examples
   * @example
   * const left = Left.from(123);
   * expect(left.mapLeft(x => x * 2)).toEqual(Left.from(246));
   *
   * const right = Right.from(123);
   * expect(right.mapLeft(x => x * 2)).toEqual(Right.from(123));
   * @param fn The function to apply.
   * @returns The result of the application.
   */
  abstract mapLeft<T>(fn: (left: L) => T): Either<T, R>;
  /**
   * Apply the function `fn` on the value in the **Right** variant if it is present,
   * rewriting the result in **Right**.
   *
   * ### Examples
   * @example
   * const left = Left.from(123);
   * expect(left.mapRight(x => x * 2)).toEqual(Left.from(123));
   *
   * const right = Right.from(123);
   * expect(right.mapRight(x => x * 2)).toEqual(Right.from(246));
   * @param fn The function to apply.
   * @returns The result of the application.
   */
  abstract mapRight<T>(fn: (right: R) => T): Either<L, T>;
  abstract match<T>(onLeft: (left: L) => T, onRight: (right: R) => T): T;
  /**
   * Convert the right side of **Either<L, R>** to an **Option<R>**.
   *
   * ### Examples
   * @example
   * const left = Left.from("left");
   * expect(left.right()).toEqual(new None());
   *
   * const right = Right.from("right");
   * expect(right.right()).toEqual(Some.of("right"));
   * @returns The converted value.
   */
  abstract right(): Option<R>;
  /**
   * Returns the left value
   *
   * ### Examples
   * @example
   * const left = Left.from(3);
   * expect(left.unwrapLeft()).toBe(3);
   *
   * ### Throws
   * When `Either` is a `Right` value.
   * @example
   * const right = Right.from(3);
   * expect(() => right.unwrapLeft()).toThrow();
   * @returns The left value.
   * @throws Error - When `Either` is a `Right` value.
   */
  abstract unwrapLeft(): L;
  /**
   * Returns the right value
   *
   * ### Examples
   * @example
   * const right = Right.from(3);
   * expect(right.unwrapRight()).toBe(3);
   *
   * ### Throws
   * When `Either` is a `Left` value.
   * @example
   * const left = Left.from(3);
   * expect(() => left.unwrapRight()).toThrow();
   * @returns The right value.
   * @throws Error - When `Either` is a `Left` value.
   */
  abstract unwrapRight(): R;
}

export class Left<L, R> extends Either<L, R> {
  private constructor(public readonly value: L) {
    super();
  }

  static from<L, R>(value: L) {
    return new this<L, R>(value);
  }

  match<T>(onLeft: (left: L) => T, _onRight: (right: R) => T): T {
    return onLeft(this.value);
  }

  isLeft(): this is Left<L, R> {
    return true;
  }

  isRight(): this is Right<L, R> {
    return false;
  }

  left(): Option<L> {
    return Some.of(this.value);
  }

  right(): Option<R> {
    return new None();
  }

  flip(): Either<R, L> {
    return Right.from(this.value);
  }

  mapLeft<T>(fn: (left: L) => T): Either<T, R> {
    return Left.from(fn(this.value));
  }

  mapRight<T>(_fn: (right: R) => T): Either<L, T> {
    return Left.from(this.value);
  }

  mapEither<T, U>(leftFn: (left: L) => T, _rightFn: (right: R) => U): Either<T, U> {
    return Left.from(leftFn(this.value));
  }

  either<T>(leftFn: (left: L) => T, _rightFn: (right: R) => T): T {
    return leftFn(this.value);
  }

  map<T>(fn: (value: L | R) => T): Either<T, T> {
    return Left.from(fn(this.value));
  }

  unwrapLeft(): L {
    return this.value;
  }

  unwrapRight(): R {
    throw new Error("Called `Either.unwrapRight()` on a `Left` value");
  }
}

export class Right<L, R> extends Either<L, R> {
  private constructor(public readonly value: R) {
    super();
  }

  static from<L, R>(value: R) {
    return new this<L, R>(value);
  }

  match<T>(_onLeft: (left: L) => T, onRight: (right: R) => T): T {
    return onRight(this.value);
  }

  isLeft(): this is Left<L, R> {
    return false;
  }

  isRight(): this is Right<L, R> {
    return true;
  }

  left(): Option<L> {
    return new None();
  }

  right(): Option<R> {
    return Some.of(this.value);
  }

  flip(): Either<R, L> {
    return Left.from(this.value);
  }

  mapLeft<T>(_fn: (left: L) => T): Either<T, R> {
    return Right.from(this.value);
  }

  mapRight<T>(fn: (right: R) => T): Either<L, T> {
    return Right.from(fn(this.value));
  }

  mapEither<T, U>(_fn: (left: L) => T, gn: (right: R) => U): Either<T, U> {
    return Right.from(gn(this.value));
  }

  either<T>(_leftFn: (left: L) => T, rightFn: (right: R) => T): T {
    return rightFn(this.value);
  }

  map<T>(fn: (value: L | R) => T): Either<T, T> {
    return Right.from(fn(this.value));
  }

  unwrapLeft(): L {
    throw new Error("Called `Either.unwrapLeft()` on a `Right` value");
  }

  unwrapRight(): R {
    return this.value;
  }
}
