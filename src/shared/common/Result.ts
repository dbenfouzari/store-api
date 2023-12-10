import type { Option } from "@shared/common/Option";

import { None, Some } from "@shared/common/Option";
import { ResultCannotGetErrorOfSuccess } from "@shared/domain/errors/ResultCannotGetErrorOfSuccess";
import { ResultCannotGetValueOfFailure } from "@shared/domain/errors/ResultCannotGetValueOfFailure";

abstract class ResultBase<T, E> {
  /**
   * Returns `result` if the result is **Ok**, otherwise returns the **Err** value of `this`.
   *
   * Arguments passed to `and` are eagerly evaluated; if you are passing the result of
   * a function call, it is recommended to use {@link andThen}, which is lazily evaluated.
   *
   * ### Examples
   * @example
   * const x: Result<number, string> = Ok.of(2);
   * const y: Result<number, string> = Err.of("late error");
   * expect(x.and(y)).toStrictEqual(Err.of("late error"));
   *
   * const x: Result<number, string> = Err.of("early error");
   * const y: Result<number, string> = Ok.of(2);
   * expect(x.and(y)).toStrictEqual(Err.of("early error"));
   *
   * const x: Result<number, string> = Err.of("not a 2");
   * const y: Result<number, string> = Err.of("late error");
   * expect(x.and(y)).toStrictEqual(Err.of("not a 2"));
   *
   * const x: Result<number, string> = Ok.of(2);
   * const y: Result<string, string> = Ok.of("different result type");
   * expect(x.and(y)).toStrictEqual(Ok.of("different result type"));
   * @param result
   */
  abstract and<U>(result: Result<U, E>): Result<U, E>;

  /**
   * Calls `fn` if the result is **Ok**, otherwise returns the **Err** value of `this`.
   *
   * This function can be used for control flow based on `Result` values.
   *
   * ### Examples
   * @example
   * function sqThenToString(x: number): Result<string, string> {
   *   return Ok.of(x * x).map(String).okOr("overflowed");
   * }
   *
   * expect(Ok.of(2).andThen(sqThenToString)).toStrictEqual(Ok.of("4"));
   * expect(Ok.of(1_000_000).andThen(sqThenToString)).toStrictEqual(Err.of("overflowed"));
   * expect(Err.of("bad number").andThen(sqThenToString)).toStrictEqual(Err.of("bad number"));
   * @param fn The function to call if the result is **Ok**.
   * @returns The result of the executed callback.
   */
  abstract andThen<U>(fn: (value: T) => Result<U, E>): Result<U, E>;

  /**
   * Returns `result` if the result is **Err**, otherwise returns the **Ok** value of `this`.
   *
   * Arguments passed to `or` are eagerly evaluated; if you are passing the result of
   * a function call, it is recommended to use {@link orElse}, which is lazily evaluated.
   *
   * ### Examples
   * @example
   * const x: Result<number, string> = Ok.of(2);
   * const y: Result<number, string> = Err.of("late error");
   * expect(x.or(y)).toStrictEqual(Ok.of(2));
   *
   * const x: Result<number, string> = Err.of("early error");
   * const y: Result<number, string> = Ok.of(2);
   * expect(x.or(y)).toStrictEqual(Ok.of(2));
   *
   * const x: Result<number, string> = Err.of("not a 2");
   * const y: Result<number, string> = Err.of("late error");
   * expect(x.or(y)).toStrictEqual(Err.of("late error"));
   *
   * const x: Result<number, string> = Ok.of(2);
   * const y: Result<number, string> = Ok.of(100);
   * expect(x.or(y)).toStrictEqual(Ok.of(2));
   * @param result
   */
  abstract or<F>(result: Result<T, F>): Result<T, F>;
  /**
   * Calls `fn` if the result is **Err**, otherwise returns the **Ok** value of `this`.
   *
   * This function can be used for control flow based on result values.
   *
   * ### Examples
   * @example
   * const sq = (x: number): Result<number, number> => Ok.of(x * x);
   * const err = (x: number): Result<number, number> => Err.of(x);
   *
   * expect(Ok.of(2).orElse(sq).orElse(sq)).toStrictEqual(Ok.of(2));
   * expect(Ok.of(2).orElse(err).orElse(sq)).toStrictEqual(Ok.of(2));
   * expect(Err.of(3).orElse(sq).orElse(err)).toStrictEqual(Ok.of(9));
   * expect(Err.of(3).orElse(err).orElse(err)).toStrictEqual(Err.of(3));
   * @param fn The function to call if the result is **Err**.
   * @returns The result of the executed callback.
   */
  abstract orElse<F>(fn: (error: E) => Result<T, F>): Result<T, F>;

  /**
   * Converts from `Result<T, E>` to {@link Option<T>}.
   *
   * Converts `this` into an {@link Option<T>}, discarding the error value, if any.
   *
   * ### Examples
   * @example
   * const x: Result<number, string> = Ok.of(2);
   * expect(x.ok()).toStrictEqual(Some.of(2));
   *
   * const x: Result<number, string> = Err.of("Nothing here");
   * expect(x.ok()).toStrictEqual(new None());
   */
  abstract ok(): Option<T>;

  /**
   * Converts from `Result<T, E>` to {@link Option<E>}.
   *
   * Converts `this` into an {@link Option<E>}, discarding the success value, if any.
   *
   * ### Examples
   * @example
   * const x: Result<number, string> = Ok.of(2);
   * expect(x.err()).toStrictEqual(new None());
   *
   * const x: Result<number, string> = Err.of("Nothing here");
   * expect(x.err()).toStrictEqual(Some.of("Nothing here"));
   */
  abstract err(): Option<E>;

  /**
   * Returns the contained {@link Ok<T>} value.
   *
   * Because this function may panic, its use is generally discouraged.
   * Instead, prefer to use pattern matching and handle the {@link Err<T>} case explicitly,
   * or call {@link unwrapOr} or {@link unwrapOrElse}.
   *
   * ### Throws
   * It throws if the value is an {@link Err<T>}, with an error message including the passed message,
   * and the content of the {@link Err<T>}.
   *
   * ### Recommended message style
   * We recommend that `expect` messages are used to describe the reason you _expect_ the **Result** to be an **Ok**.
   * **Hint**: If you're having trouble remembering how to phrase expect error messages,
   * remember to focus on the work "should" as in "env variable `IMPORTANT_PATH` should be set by blah"
   * or "user should be logged in when calling this endpoint".
   *
   * ### Examples
   * @example Should throw
   * const x: Result<number, string> = Err.of("emergency failure");
   * x.expect("Testing expect"); // throws `new Error("emergency failure")`
   * @example With recommended message style
   * const path = ConfigService.get("IMPORTANT_PATH")
   *   .expect("env variable `IMPORTANT_PATH` should be set by `wrapper_script.sh`");
   * @param message The message to be included in the error.
   * @throws - An error if the value is an {@link Err<T>}, with a custom panic message provided by `message`.
   * @returns The contained {@link Ok<T>} value.
   */
  abstract expect(message: string): T;

  /**
   * Returns the contained {@link Err<E>} value.
   *
   * ### Throws
   * It throws if the value is an {@link Ok<T>}, with a custom panic message including the passed message,
   * and the content of the {@link Ok<T>}.
   *
   * ### Examples
   * @example Should throw
   * const x: Result<number, string> = Ok.of(10);
   * x.expectErr("Testing expectErr"); // throws `new Error("10")`
   * @param message The message to be included in the error.
   * @throws - An error if the value is an {@link Ok<T>}, with a custom panic message provided by `message`.
   * @returns The contained {@link Err<E>} value.
   */
  abstract expectErr(message: string): E;

  /**
   * Returns `true` if the result is **Err**, otherwise returns `false`.
   *
   * ### Examples
   * @example
   * const x: Result<number, string> = Ok.of(2);
   * expect(x.isErr()).toBe(false);
   *
   * const x: Result<number, string> = Err.of("Error");
   * expect(x.isErr()).toBe(true);
   * @returns `true` if the result is **Err**, otherwise returns `false`.
   */
  abstract isErr(): boolean;

  /**
   * Returns `true` if the result is **Err** and its error value satisfies the given predicate `predicate`.
   *
   * ### Examples
   * @example
   * const x: Result<number, string> = Err.of("Not Found");
   * expect(x.isErrAnd((error) => error === "Not Found")).toBe(true);
   *
   * const x: Result<number, string> = Err.of("Permission Denied");
   * expect(x.isErrAnd((error) => error === "Not Found")).toBe(false);
   *
   * const x: Result<number, string> = Ok.of(2);
   * expect(x.isErrAnd((error) => error === "Not Found")).toBe(false);
   * @param predicate
   */
  abstract isErrAnd(predicate: (error: E) => boolean): boolean;

  /**
   * Returns `true` if the result is **Ok**, otherwise returns `false`.
   *
   * ### Examples
   * @example
   * const x: Result<number, string> = Ok.of(2);
   * expect(x.isOk()).toBe(true);
   *
   * const x: Result<number, string> = Err.of("Error");
   * expect(x.isOk()).toBe(false);
   * @returns `true` if the result is **Ok**, otherwise returns `false`.
   */
  abstract isOk(): boolean;

  /**
   * Returns `true` if the result is **Ok** and its value satisfies the given predicate `predicate`.
   *
   * ### Examples
   * @example
   * const x: Result<number, string> = Ok.of(2);
   * expect(x.isOkAnd((value) => value > 1)).toBe(true);
   *
   * const x: Result<number, string> = Ok.of(0);
   * expect(x.isOkAnd((value) => value > 1)).toBe(false);
   *
   * const x: Result<number, string> = Err.of("Error");
   * expect(x.isOkAnd((value) => value > 1)).toBe(false);
   * @param predicate The predicate to be evaluated.
   * @returns `true` if the result is **Ok** and its value satisfies the given predicate `predicate`, otherwise returns `false`.
   */
  abstract isOkAnd(predicate: (value: T) => boolean): boolean;

  /**
   * Maps a {@link Result<T, E>} to {@link Result<U, E>} by applying a function to a contained {@link Ok<T>} value,
   * leaving an {@link Err<E>} value untouched.
   *
   * This function can be used to compose the results of two functions.
   *
   * ### Examples
   * @example Print the numbers on each line of a string multiplied by two.
   * const line = "1\n2\n3\n4\n";
   *
   * for (const num of line.split("\n")) {
   *   const result = Ok.of(num)
   *     .map((num) => parseInt(num) * 2)
   *     .map((num) => num.toString());
   * }
   * @param fn
   */
  abstract map<U>(fn: (value: T) => U): Result<U, E>;

  /**
   * Maps a {@link Result<T, E>} to {@link Result<T, F>} by applying a function to a contained {@link Err<E>} value,
   * leaving an {@link Ok<T>} value untouched.
   *
   * This function can be used to pass through a successful result while handling an error.
   *
   * ### Examples
   * @example
   * const stringify = (x: number): string => `error code: ${x}`;
   *
   * const x: Result<number, number> = Ok.of(2);
   * expect(x.mapErr(stringify)).toStrictEqual(Ok.of(2));
   *
   * const x: Result<number, number> = Err.of(13);
   * expect(x.mapErr(stringify)).toStrictEqual(Err.of("error code: 13"));
   * @param fn The function to call if the result is **Err**.
   * @returns The result of the executed callback.
   */
  abstract mapErr<F>(fn: (error: E) => F): Result<T, F>;

  /**
   * Returns the provided default value if the result is an {@link Err<E>},
   * otherwise applies the provided function `fn` to the contained value `T` (if **Ok**).
   *
   * Arguments passed to `mapOr` are eagerly evaluated; if you are passing the result of a function call,
   * it is recommended to use {@link mapOrElse}, which is lazily evaluated.
   *
   * ### Examples
   * @example
   * const x: Result<string, string> = Ok.of("foo");
   * expect(x.mapOr(42, (v) => v.length)).toBe(3);
   *
   * const x: Result<string, string> = Err.of("bar");
   * expect(x.mapOr(42, (v) => v.length)).toBe(42);
   * @param defaultValue The default value to return if the result is an {@link Err<E>}.
   * @param fn The function to call if the result is **Ok**.
   * @returns The result of the executed callback.
   */
  abstract mapOr<U>(defaultValue: U, fn: (value: T) => U): U;

  /**
   * Maps a `Result<T, E>` to `U` by applying a function to a contained {@link Err} value,
   * or a fallback function to a contained {@link Ok} value.
   *
   * This function can be used to unpack a successful result while handling an error.
   *
   * ### Examples
   * @example
   * const k = 21;
   *
   * const x: Result<string, string> = Ok.of("foo");
   * expect(x.mapOrElse(() => 2 * k, (v) => v.length)).toBe(3);
   *
   * const x: Result<string, string> = Err.of("bar");
   * expect(x.mapOrElse(() => 2 * k, (v) => v.length)).toBe(42);
   * @param defaultFn The function to call if the result is **Err**.
   * @param fn The function to call if the result is **Ok**.
   * @returns The result of the executed callback.
   */
  abstract mapOrElse<U>(defaultFn: (error: E) => U, fn: (value: T) => U): U;

  /**
   * Return the contained {@link Ok} value.
   *
   * Because this function may panic, its use is generally discouraged.
   * Instead, prefer to use pattern matching and handle the {@link Err} case explicitly,
   * or call {@link unwrapOr}, {@link unwrapOrElse}.
   *
   * ### Throws
   * It throws if the value is an {@link Err}, with an error message including the passed message,
   * and the content of the {@link Err}.
   *
   * ### Examples
   * @example Should throw
   * const x: Result<number, string> = Err.of("emergency failure");
   * x.unwrap(); // throws `new Error("emergency failure")`
   * @example
   * const x: Result<number, string> = Ok.of(2);
   * expect(x.unwrap()).toBe(2);
   * @returns The contained {@link Ok} value.
   */
  abstract unwrap(): T;
  /**
   * Return the contained {@link Err} value.
   *
   * ### Throws
   * It throws if the value is an {@link Ok}, with a custom panic message including the passed message,
   * and the content of the {@link Ok}.
   *
   * ### Examples
   * @example Should throw
   * const x: Result<number, string> = Ok.of(10);
   * x.unwrapErr(); // throws `new Error("10")`
   * @example
   * const x: Result<number, string> = Err.of("emergency failure");
   * expect(x.unwrapErr()).toBe("emergency failure");
   * @returns The contained {@link Err} value.
   */
  abstract unwrapErr(): E;

  /**
   * Return the contained {@link Ok} value or a provided default.
   *
   * Arguments passed to `unwrapOr` are eagerly evaluated; if you are passing the result of a function call,
   * it is recommended to use {@link unwrapOrElse}, which is lazily evaluated.
   *
   * ### Examples
   * @example
   * const x: Result<number, string> = Ok.of(9);
   * expect(x.unwrapOr(2)).toBe(9);
   *
   * const x: Result<number, string> = Err.of("error");
   * expect(x.unwrapOr(2)).toBe(2);
   * @param defaultValue The default value to return if the result is an {@link Err}.
   * @returns The contained {@link Ok} value or a provided default.
   */
  abstract unwrapOr(defaultValue: T): T;

  /**
   * Return the contained {@link Ok} value or compute it from a closure.
   *
   * ### Examples
   * @example
   * const count = (x: string): number => x.length;
   *
   * expect(Ok.of(2).unwrapOrElse(count)).toBe(2);
   * expect(Err.of("foo").unwrapOrElse(count)).toBe(3);
   * @param fn The function to call if the result is **Err**.
   * @returns The contained {@link Ok} value or a provided default.
   */
  abstract unwrapOrElse(fn: (error: E) => T): T;

  abstract match<R>(onSuccess: (value: T) => R, onFailure: (error: E) => R): R;

  /**
   * Transposes a `Result` of an `Option` into an `Option` of a `Result`.
   * `Ok<None>` will be mapped to `None`.
   * `Ok<Some<T>>` and `Err<E>` will be mapped to `Some<Ok<T>>` and `Some<Err<E>>`.
   *
   * ### Examples
   * @example
   * const x: Result<Option<number>, string> = Ok.of(Some.of(2));
   * const y: Option<Result<number, string>> = Some.of(Ok.of(2));
   * expect(x.transpose()).toStrictEqual(y);
   */
  abstract transpose(): Option<Result<T, E>>;
}

export class Ok<T, E> extends ResultBase<T, E> {
  private readonly _value: T;

  constructor(value: T) {
    super();
    this._value = value;
  }

  public static of<T, E>(value: T): Result<T, E> {
    return new Ok(value);
  }

  public and<U>(result: Result<U, E>): Result<U, E> {
    return result;
  }

  public andThen<U, F>(fn: (value: T) => Result<U, F>): Result<U, F> {
    return fn(this._value);
  }

  public or<F>(_result: Result<T, F>): Result<T, F> {
    return Ok.of(this._value);
  }

  public orElse<F>(_fn: (error: E) => Result<T, F>): Result<T, F> {
    return Ok.of(this._value);
  }

  public ok(): Option<T> {
    return Some.of(this._value);
  }

  public err(): Option<E> {
    return new None();
  }

  public expect(_message: string): T {
    return this._value;
  }

  public expectErr(message: string): E {
    throw new ResultCannotGetValueOfFailure(message);
  }

  public isErr(): boolean {
    return false;
  }

  public isErrAnd(_predicate: (error: E) => boolean): boolean {
    return false;
  }

  public isOk(): boolean {
    return true;
  }

  public isOkAnd(predicate: (value: T) => boolean): boolean {
    return predicate(this._value);
  }

  public map<U>(fn: (value: T) => U): Result<U, E> {
    return Ok.of(fn(this._value));
  }

  public mapErr<F>(_fn: (error: E) => F): Result<T, F> {
    return Ok.of(this._value);
  }

  public mapOr<U>(_defaultValue: U, fn: (value: T) => U): U {
    return fn(this._value);
  }

  public mapOrElse<U>(_defaultFn: (error: E) => U, fn: (value: T) => U): U {
    return fn(this._value);
  }

  public unwrap(): T {
    return this._value;
  }

  public unwrapErr(): E {
    throw new ResultCannotGetErrorOfSuccess();
  }

  public unwrapOr(_defaultValue: T): T {
    return this._value;
  }

  public unwrapOrElse(_fn: (error: E) => T): T {
    return this._value;
  }

  public match<R>(onSuccess: (value: T) => R, _onFailure: (error: E) => R): R {
    return onSuccess(this._value);
  }

  public transpose(): Option<Result<T, E>> {
    return this._value instanceof None ? new None() : Some.of(Ok.of(this._value));
  }
}

export class Err<T, E> extends ResultBase<T, E> {
  private readonly _value: E;

  constructor(value: E) {
    super();
    this._value = value;
  }

  public static of<T, E>(error: E): Result<T, E> {
    return new Err(error);
  }

  public and<U>(_result: Result<U, E>): Result<U, E> {
    return Err.of(this._value);
  }

  public andThen<U, F>(_fn: (value: T) => Result<U, F>): Result<U, F> {
    return Err.of(this._value as unknown as F);
  }

  public or<F>(result: Result<T, F>): Result<T, F> {
    return result;
  }

  public orElse<F>(fn: (error: E) => Result<T, F>): Result<T, F> {
    return fn(this._value);
  }

  public ok(): Option<T> {
    return new None();
  }

  public err(): Option<E> {
    return Some.of(this._value);
  }

  public expect(message: string): T {
    throw new ResultCannotGetValueOfFailure(message);
  }

  public expectErr(_message: string): E {
    return this._value;
  }

  public isErr(): boolean {
    return true;
  }

  public isErrAnd(predicate: (error: E) => boolean): boolean {
    return predicate(this._value);
  }

  public isOk(): boolean {
    return false;
  }

  public isOkAnd(_predicate: (value: T) => boolean): boolean {
    return false;
  }

  public map<U>(_fn: (value: T) => U): Result<U, E> {
    return Err.of(this._value);
  }

  public mapErr<F>(fn: (error: E) => F): Result<T, F> {
    return Err.of(fn(this._value));
  }

  public mapOr<U>(defaultValue: U, _fn: (value: T) => U): U {
    return defaultValue;
  }

  public mapOrElse<U>(defaultFn: (error: E) => U, _fn: (value: T) => U): U {
    return defaultFn(this._value);
  }

  public unwrap(): T {
    throw new ResultCannotGetValueOfFailure();
  }

  public unwrapErr(): E {
    return this._value;
  }

  public unwrapOr(defaultValue: T): T {
    return defaultValue;
  }

  public unwrapOrElse(fn: (error: E) => T): T {
    return fn(this._value);
  }

  public match<R>(_onSuccess: (value: T) => R, onFailure: (error: E) => R): R {
    return onFailure(this._value);
  }

  public transpose(): Option<Result<T, E>> {
    return Some.of(Err.of(this._value));
  }
}

export type Result<T, E> = Ok<T, E> | Err<T, E>;
