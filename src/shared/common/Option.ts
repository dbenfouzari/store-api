import type { Result } from "@shared/common/Result";

import { Err, Ok } from "@shared/common/Result";
import { OptionCannotGetValueOfNone } from "@shared/domain/errors/OptionCannotGetValueOfNone";

// noinspection JSUnusedGlobalSymbols
abstract class OptionAbstract<T> {
  /**
   * Returns `true` if the option is a **Some** value.
   *
   * ### Examples
   * @example
   * const x = Some.of(2);
   * expect(x.isSome()).toBe(true);
   *
   * const y = new None();
   * expect(y.isSome()).toBe(false);
   * @returns A boolean.
   */
  abstract isSome(): boolean;
  /**
   * Returns `true` if the option is a **None** value.
   *
   * ### Examples
   * @example
   * const x = Some.of(2);
   * expect(x.isNone()).toBe(false);
   *
   * const y = new None();
   * expect(y.isNone()).toBe(true);
   * @returns A boolean.
   */
  abstract isNone(): boolean;

  /**
   * Returns the contained **Some** value.
   *
   * ### Throws
   * Throws an error if the option is **None** with the provided message.
   *
   * ### Recommended message style
   * We recommend that `expect` messages are used to describe the reason you
   * _expect_ the `Option` to be `Some`. This helps with debugging.
   *
   * ### Examples
   * @example
   * const x = Some.of("value");
   * expect(x.expect("message")).toBe("value");
   *
   * const y = new None();
   * expect(() => y.expect("message")).toThrow("message");
   * @example Should throw
   * const x = new None();
   * expect(() => x.expect("Expected to be some")).toThrow("Expected to be some");
   * @param message The message to throw if the option is **None**.
   * @returns A T.
   */
  abstract expect(message: string): T;

  /**
   * Returns the contained **Some** value or throws an error.
   *
   * Because this function may throw, its use is generally discouraged.
   * Instead, prefer to handle the **None** case explicitly, or call `unwrapOr`,
   *
   * ### Throws
   *
   * Throws an error if the option is **None**.
   *
   * ### Examples
   * @example
   * const x = Some.of("air");
   * expect(x.unwrap()).toBe("air");
   * @example Should throw
   * const x = new None();
   * expect(() => x.unwrap()).toThrow("Option is none");
   * @returns A T.
   * @throws Error - An error if the option is **None**.
   */
  abstract unwrap(): T;
  /**
   * Returns the contained **Some** value or a provided default.
   *
   * ### Examples
   * @example
   * expect(Some.of("car").unwrapOr("bike")).toBe("car");
   * expect(new None().unwrapOr("bike")).toBe("bike");
   * @param defaultValue The default value to return if none.
   * @returns A T.
   */
  abstract unwrapOr<U>(defaultValue: U): T | U;

  /**
   * Returns the contained **Some** value or computes it from a closure.
   *
   * ### Examples
   * @example
   * const k = 10;
   * expect(Some.of(4).unwrapOrElse(() => 2 * k)).toBe(4);
   * expect(new None().unwrapOrElse(() => 2 * k)).toBe(20);
   * @param fn A function that returns a T.
   * @returns A T.
   */
  abstract unwrapOrElse<U>(fn: () => U): T | U;

  /**
   * Maps an **Option<T>** to **Option<T2>** by applying a function to
   * a contained value (if Some) or returns None (if None).
   *
   * ### Examples
   * @example Calculates the length of an <code>Option<string></code> as an <code>Option<number></code>:
   * const maybeSomeString = Some.of("Hello, world!");
   * const maybeStringLength = maybeSomeString.map((s) => s.length);
   * expect(maybeStringLength).toStrictEqual(Some.of(13));
   *
   * const maybeNoneString = new None<string>();
   * const maybeNoneStringLength = maybeNoneString.map((s) => s.length);
   * expect(maybeNoneStringLength).toStrictEqual(new None());
   * @param fn Function to apply to the contained value.
   * @returns An Option<U>.
   */
  abstract map<U>(fn: (value: T) => U): Option<U>;
  /**
   * Returns the provided default result (if none), or applies a function
   * to the contained value (if any).
   *
   * ### Examples
   * @example
   * const option = Some.of("value");
   * expect(option.mapOr("default", (value) => value + " mapped")).toBe("value mapped");
   *
   * const option = new None();
   * expect(option.mapOr("default", (value) => value + " mapped")).toBe("default");
   * @param defaultValue The default value to return if none.
   * @param fn Function to apply to the contained value.
   * @returns A T2.
   */
  abstract mapOr<U>(defaultValue: U, fn: (value: T) => U): U;

  /**
   * Returns the provided default result (if none), or computes it from a closure.
   * Returns the contained value (if any) regardless.
   *
   * ### Examples
   * @example
   * const option = Some.of("value");
   * expect(option.mapOrElse(() => "default", (value) => value + " mapped")).toBe("value mapped");
   *
   * const option = new None();
   * expect(option.mapOrElse(() => "default", (value) => value + " mapped")).toBe("default");
   * @param fn A function that returns a T2.
   * @param defaultFn A function that returns a T2.
   * @returns A T2.
   */
  abstract mapOrElse<U>(fn: (value: T) => U, defaultFn: () => U): U;
  /**
   * Converts from `Option<Option<T>>` to `Option<T>`.
   *
   * ### Examples
   * @example
   * const x = Some.of(Some.of("foo"));
   * expect(x.flatMap(identity)).toStrictEqual(Some.of("foo"));
   * @param fn A function that returns an option of type T.
   * @returns An option of type T.
   */
  abstract flatMap<U>(fn: (value: T) => Option<U>): Option<U>;

  /**
   * Returns a Result<T, E> containing the contained value (if Some),
   * otherwise returns a Result<T, E> containing the provided error.
   *
   * ### Examples
   * @example
   * const option = Some.of("value");
   * expect(option.okOr("error")).toStrictEqual(Ok.of("value"));
   *
   * const option = new None();
   * expect(option.okOr("error")).toStrictEqual(Err.of("error"));
   * @param error The error to return if none.
   * @returns A Result<T, E>.
   */
  abstract okOr<E>(error: E): Result<T, E>;

  /**
   * Returns **None** if the option is **None**, otherwise returns `other`.
   *
   * ### Examples
   * @example
   * const x = Some.of(2);
   * const y = new None<string>();
   * expect(x.and(y)).toStrictEqual(new None());
   *
   * const x = new None<number>();
   * const y = Some.of("foo");
   * expect(x.and(y)).toStrictEqual(new None());
   *
   * const x = Some.of(2);
   * const y = Some.of("foo");
   * expect(x.and(y)).toStrictEqual(Some.of("foo"));
   *
   * const x = new None<number>();
   * const y = new None<string>();
   * expect(x.and(y)).toStrictEqual(new None());
   * @param other An option of type T.
   * @returns An option of type T.
   */
  abstract and<U>(other: Option<U>): Option<U>;

  /**
   * Returns **None** if the option is **None**, otherwise calls `predicate` with the
   * wrapped value and returns:
   * - **Some(t)** if `predicate` returns `true` (where `t` is the wrapped value), and
   * - **None** if `predicate` returns `false`.
   *
   * ### Examples
   * @example
   * function isEven(n: number): boolean {
   *   return n % 2 === 0;
   * }
   *
   * expect(new None().andThen(isEven)).toStrictEqual(new None());
   * expect(Some.of(3).andThen(isEven)).toStrictEqual(new None());
   * expect(Some.of(4).andThen(isEven)).toStrictEqual(Some.of(4));
   * @param fn A function that returns an option of type T.
   * @returns An option of type T.
   */
  abstract andThen<U>(fn: (value: T) => Option<U>): Option<U>;

  /**
   * Returns the option if it contains a value, otherwise returns `other`.
   *
   * ### Examples
   * @example Returns `x` since it contains a value.
   * const x = Some.of(2);
   * const y = new None();
   * expect(x.or(y)).toStrictEqual(Some.of(2));
   * @example Returns `y` since `x` doesn't contain a value.
   * const x = new None();
   * const y = Some.of(100);
   * expect(x.or(y)).toStrictEqual(Some.of(100));
   * @example Returns `x` since `x` contains a value.
   * const x = Some.of(2);
   * const y = Some.of(100);
   * expect(x.or(y)).toStrictEqual(Some.of(2));
   * @example Returns **None** since neither `x` nor `y` contain a value.
   * const x = new None();
   * const y = new None();
   * expect(x.or(y)).toStrictEqual(new None());
   * @param other An option of type T.
   * @returns An option of type T.
   */
  abstract or<U>(other: Option<U>): Option<T | U>;

  /**
   * Returns the option if it contains a value, otherwise calls `fn` and returns the
   * result.
   *
   * ### Examples
   * @example Returns `x` since it contains a value.
   * const x = Some.of(2);
   * const y = new None();
   * expect(x.orElse(() => y)).toStrictEqual(Some.of(2));
   * @example Returns `y` since `x` doesn't contain a value.
   * const x = new None();
   * const y = Some.of(100);
   * expect(x.orElse(() => y)).toStrictEqual(Some.of(100));
   * @example Returns `x` since `x` contains a value.
   * const x = Some.of(2);
   * const y = Some.of(100);
   * expect(x.orElse(() => y)).toStrictEqual(Some.of(2));
   * @example Returns **None** since neither `x` nor `y` contain a value.
   * const x = new None();
   * const y = new None();
   * expect(x.orElse(() => y)).toStrictEqual(new None());
   * @param fn A function that returns an option of type T.
   * @returns An option of type T.
   */
  abstract orElse<U>(fn: () => Option<U>): Option<T | U>;

  /**
   * Returns **None** if the option is **None**, otherwise calls `predicate` with the
   * wrapped value and returns:
   *
   * - **Some(t)** if `predicate` returns `true` (where `t` is the wrapped value), and
   * - **None** if `predicate` returns `false`.
   *
   * ### Examples
   * @example
   * function isEven(n: number): boolean {
   *   return n % 2 === 0;
   * }
   *
   * expect(new None().filter(isEven)).toStrictEqual(new None());
   * expect(Some.of(3).filter(isEven)).toStrictEqual(new None());
   * expect(Some.of(4).filter(isEven)).toStrictEqual(Some.of(4));
   * @param fn A function that returns an option of type T.
   * @returns An option of type T.
   */
  abstract filter(fn: (value: T) => boolean): Option<T>;
  /**
   * Zips `self` with another `Option`.
   *
   * If `self` is `Some(s)` and `other` is `Some(o)`, this method returns `Some([s, o])`.
   * Otherwise, `None` is returned.
   *
   * ### Examples
   * @example
   * const x = Some.of(1);
   * const y = Some.of("hi");
   * const z = new None();
   *
   * expect(x.zip(y)).toStrictEqual(Some.of([1, "hi"]));
   * expect(x.zip(z)).toStrictEqual(new None());
   * @param other An option of type U.
   * @returns An option of type [T, U].
   */
  abstract zip<U>(other: Option<U>): Option<[T, U]>;
  /**
   * Unzips an option containing a tuple of two options into two separate options.
   *
   * If `this` is `Some((a, b))`, this method returns `[Some(a), Some(b)]`.
   * Otherwise, `[None, None]` is returned.
   *
   * ### Examples
   * @example
   * const x = Some.of([1, "hi"]);
   * const [y, z] = x.unzip();
   * expect(y).toStrictEqual(Some.of(1));
   * expect(z).toStrictEqual(Some.of("hi"));
   *
   * const x = new None();
   * const [y, z] = x.unzip();
   * expect(y).toStrictEqual(new None());
   * expect(z).toStrictEqual(new None());
   * @returns An array of options.
   */
  abstract unzip<A, B>(): [Option<A>, Option<B>];

  /**
   * Unzips an option containing a tuple of two options into two separate options.
   * This is similar to `unzip`, but allows a function to be applied to the contained
   * values.
   *
   * If `this` is `Some((a, b))`, this method returns `[Some(f(a)), Some(g(b))]`.
   * Otherwise, `[None, None]` is returned.
   *
   * ### Examples
   * @example
   * const x = Some.of([1, "hi"]);
   * const [y, z] = x.unzipWith(([a, b]) => [a + 1, b + "!"]);
   * expect(y).toStrictEqual(Some.of(2));
   * expect(z).toStrictEqual(Some.of("hi!"));
   *
   * const x = new None();
   * const [y, z] = x.unzipWith(([a, b]) => [a + 1, b + "!"]);
   * expect(y).toStrictEqual(new None());
   * expect(z).toStrictEqual(new None());
   * @param fn A function that returns a tuple of type [A, B].
   * @returns An array of options.
   */
  abstract unzipWith<A, B>(fn: (value: T) => [A, B]): [Option<A>, Option<B>];

  /**
   * Applies a function to the contained value (if any), or returns the provided default (if not).
   * Returns the result of the function application.
   * This function can be used to unpack an option while handling its none case.
   *
   * ### Examples
   * @example
   * const x = Some.of("foo");
   * expect(x.match((v) => v + "bar", () => "baz")).toBe("foobar");
   *
   * const x = new None();
   * expect(x.match((v) => v + "bar", () => "baz")).toBe("baz");
   * @param onSome A function that returns a U. Called if the option is **Some**.
   * @param onNone A function that returns a U. Called if the option is **None**.
   * @returns A U.
   */
  abstract match<U>(onSome: (value: T) => U, onNone: () => U): U;
}

export class Some<T> extends OptionAbstract<T> {
  public readonly value: T;

  constructor(value: T) {
    super();
    this.value = value;
  }

  static of<T>(value: T): Some<T> {
    return new Some<T>(value);
  }

  isSome(): this is Some<T> {
    return true;
  }

  isNone(): this is None<T> {
    return false;
  }

  expect(_message: string): T {
    return this.value;
  }

  unwrap(): T {
    return this.value;
  }

  unwrapOr<U>(_defaultValue: U): T | U {
    return this.value;
  }

  unwrapOrElse<U>(_fn: () => U): T | U {
    return this.value;
  }

  map<U>(fn: (value: T) => U): Option<U> {
    return new Some<U>(fn(this.value));
  }

  mapOr<U>(_defaultValue: U, fn: (value: T) => U): U {
    return fn(this.value);
  }

  mapOrElse<U>(fn: (value: T) => U, _defaultFn: () => U): U {
    return fn(this.value);
  }

  flatMap<U>(fn: (value: T) => Option<U>): Option<U> {
    return fn(this.value);
  }

  okOr<E>(_error: E): Result<T, E> {
    return Ok.of(this.value);
  }

  and<U>(option: Option<U>): Option<U> {
    return option;
  }

  andThen<U>(fn: (value: T) => Option<U>): Option<U> {
    return fn(this.value);
  }

  filter(fn: (value: T) => boolean): Option<T> {
    return fn(this.value) ? this : new None<T>();
  }

  or<U>(_option: Option<U>): Option<T | U> {
    return this;
  }

  orElse<U>(_fn: () => Option<U>): Option<T | U> {
    return this;
  }

  zip<U>(option: Option<U>): Option<[T, U]> {
    return option.map((value) => [this.value, value]);
  }

  unzip<A, B>(this: Option<[A, B]>): [Option<A>, Option<B>] {
    return [this.map(([a]) => a), this.map(([_, b]) => b)];
  }

  unzipWith<A, B>(fn: (value: T) => [A, B]): [Option<A>, Option<B>] {
    const [a, b] = fn(this.value);
    return [new Some(a), new Some(b)];
  }

  match<U>(onSome: (value: T) => U, _onNone: () => U): U {
    return onSome(this.value);
  }
}

export class None<T> extends OptionAbstract<T> {
  isSome(): this is Some<T> {
    return false;
  }

  isNone(): this is None<T> {
    return true;
  }

  expect(message: string): T {
    throw new Error(message);
  }

  unwrap(): T {
    throw new OptionCannotGetValueOfNone();
  }

  unwrapOr<U>(defaultValue: U): T | U {
    return defaultValue;
  }

  unwrapOrElse<U>(fn: () => U): T | U {
    return fn();
  }

  map<U>(_fn: (value: T) => U): Option<U> {
    return new None<U>();
  }

  mapOr<U>(defaultValue: U, _fn: (value: T) => U): U {
    return defaultValue;
  }

  mapOrElse<U>(_fn: (value: T) => U, defaultFn: () => U): U {
    return defaultFn();
  }

  flatMap<U>(_fn: (value: T) => Option<U>): Option<U> {
    return new None<U>();
  }

  okOr<E>(error: E): Result<T, E> {
    return Err.of(error);
  }

  and<U>(_option: Option<U>): Option<U> {
    return new None<U>();
  }

  andThen<U>(_fn: (value: T) => Option<U>): Option<U> {
    return new None<U>();
  }

  filter(_fn: (value: T) => boolean): Option<T> {
    return this;
  }

  or<U>(option: Option<U>): Option<U> {
    return option;
  }

  orElse<U>(fn: () => Option<U>): Option<U> {
    return fn();
  }

  zip<U>(_option: Option<U>): Option<[T, U]> {
    return new None<[T, U]>();
  }

  unzip<A, B>(this: None<[A, B]>): [Option<A>, Option<B>] {
    return [new None<A>(), new None<B>()];
  }

  unzipWith<A, B>(_fn: (value: T) => [A, B]): [Option<A>, Option<B>] {
    return [new None<A>(), new None<B>()];
  }

  match<U>(_onSome: (value: T) => U, onNone: () => U): U {
    return onNone();
  }
}

export type Option<T> = Some<T> | None<T>;
