import { Result } from "@shared/common/Result";
import { identity, identityCurry } from "@shared/common/identity";

/**
 * Option is a container that may or may not hold a single value.
 * It is inspired by Rust's Option type.
 */
export abstract class Option<T> {
  //#region Constructors
  /**
   * Creates a new **Some** option.
   * @param value The value to wrap.
   * @returns A new **Some** option.
   */
  public static some<T>(value: T) {
    return new Some(value);
  }

  /**
   * Creates a new **None** option.
   * @returns A new **None** option.
   */
  public static none<T>() {
    return new None<T>();
  }
  //#endregion

  /**
   * Returns `true` if the option is a **Some** value.
   *
   * ### Examples
   * @example
   * const x = Option.some(2);
   * expect(x.isSome()).toBe(true);
   *
   * const y = Option.none();
   * expect(y.isSome()).toBe(false);
   * @returns A boolean.
   */
  public isSome(): this is Some<T> {
    return this instanceof Some;
  }

  /**
   * Returns `true` if the option is a **None** value.
   *
   * ### Examples
   * @example
   * const x = Option.some(2);
   * expect(x.isNone()).toBe(false);
   *
   * const y = Option.none();
   * expect(y.isNone()).toBe(true);
   * @returns A boolean.
   */
  public isNone(): this is None<T> {
    return this instanceof None;
  }

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
   * const x = Option.some("value");
   * expect(x.expect("message")).toBe("value");
   *
   * const y = Option.none();
   * expect(() => y.expect("message")).toThrow("message");
   * @example Should throw
   * const x = Option.none();
   * expect(() => x.expect("Expected to be some")).toThrow("Expected to be some");
   * @param message The message to throw if the option is **None**.
   * @returns A T.
   */
  public expect(message: string): T {
    return this.match(identity, () => {
      throw new Error(message);
    });
  }

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
   * const x = Option.some("air");
   * expect(x.unwrap()).toBe("air");
   * @example Should throw
   * const x = Option.none();
   * expect(() => x.unwrap()).toThrow("Option is none");
   * @returns A T.
   * @throws Error - An error if the option is **None**.
   */
  public unwrap(): T {
    return this.match(identity, () => {
      throw new Error("Option is none");
    });
  }

  /**
   * Returns the contained **Some** value or a provided default.
   *
   * ### Examples
   * @example
   * expect(Option.some("car").unwrapOr("bike")).toBe("car");
   * expect(Option.none().unwrapOr("bike")).toBe("bike");
   * @param defaultValue The default value to return if none.
   * @returns A T.
   */
  public unwrapOr(defaultValue: T): T {
    return this.match(identity, identityCurry(defaultValue));
  }

  public match<U>(some: (value: T) => U, none: () => U): U {
    if (this.isSome()) {
      return some(this.value);
    }

    return none();
  }

  /**
   * Maps an **Option<T>** to **Option<T2>** by applying a function to
   * a contained value (if Some) or returns None (if None).
   *
   * ### Examples
   * @example Calculates the length of an <code>Option<string></code> as an <code>Option<number></code>:
   * const maybeSomeString = Option.some("Hello, world!");
   * const maybeStringLength = maybeSomeString.map((s) => s.length);
   * expect(maybeStringLength).toStrictEqual(Option.some(13));
   *
   * const maybeNoneString = Option.none<string>();
   * const maybeNoneStringLength = maybeNoneString.map((s) => s.length);
   * expect(maybeNoneStringLength).toStrictEqual(Option.none());
   * @param fn Function to apply to the contained value.
   * @returns An Option<U>.
   */
  public map<T2>(fn: (value: T) => T2): Option<T2> {
    return this.match(
      (value) => new Some(fn(value)),
      () => new None()
    );
  }

  /**
   * Returns the provided default result (if none), or applies a function
   * to the contained value (if any).
   *
   * ### Examples
   * @example
   * const option = Option.some("value");
   * expect(option.mapOr("default", (value) => value + " mapped")).toBe("value mapped");
   *
   * const option = Option.none();
   * expect(option.mapOr("default", (value) => value + " mapped")).toBe("default");
   * @param defaultValue The default value to return if none.
   * @param fn Function to apply to the contained value.
   * @returns A T2.
   */
  public mapOr<T2>(defaultValue: T2, fn: (value: T) => T2): T2 {
    return this.match(fn, identityCurry(defaultValue));
  }

  /**
   * Returns a Result<T, E> containing the contained value (if Some),
   * otherwise returns a Result<T, E> containing the provided error.
   *
   * ### Examples
   * @example
   * const option = Option.some("value");
   * expect(option.okOr("error")).toStrictEqual(Result.ok("value"));
   *
   * const option = Option.none();
   * expect(option.okOr("error")).toStrictEqual(Result.fail("error"));
   * @param error The error to return if none.
   * @returns A Result<T, E>.
   */
  public okOr<E>(error: E): Result<T, E> {
    return this.match(
      (value) => Result.ok(value),
      () => Result.fail(error)
    );
  }

  /**
   * Returns **None** if the option is **None**, otherwise returns `other`.
   *
   * ### Examples
   * @example
   * const x = Option.some(2);
   * const y = Option.none<string>();
   * expect(x.and(y)).toStrictEqual(new None());
   *
   * const x = Option.none<number>();
   * const y = Option.some("foo");
   * expect(x.and(y)).toStrictEqual(new None());
   *
   * const x = Option.some(2);
   * const y = Option.some("foo");
   * expect(x.and(y)).toStrictEqual(Option.some("foo"));
   *
   * const x = Option.none<number>();
   * const y = Option.none<string>();
   * expect(x.and(y)).toStrictEqual(new None());
   * @param other An option of type T.
   * @returns An option of type T.
   */
  public and<U>(other: Option<U>): Option<U> {
    return this.match(
      () => other,
      () => new None()
    );
  }

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
   * expect(Option.none().filter(isEven)).toStrictEqual(Option.none());
   * expect(Option.some(3).filter(isEven)).toStrictEqual(Option.none());
   * expect(Option.some(4).filter(isEven)).toStrictEqual(Option.some(4));
   * @param predicate A function that returns an option of type T.
   * @returns An option of type T.
   */
  public filter(predicate: (value: T) => boolean): Option<T> {
    return this.match(
      (value) => (predicate(value) ? this : new None()),
      () => new None()
    );
  }

  /**
   * Returns the option if it contains a value, otherwise returns `other`.
   *
   * ### Examples
   * @example Returns `x` since it contains a value.
   * const x = Option.some(2);
   * const y = Option.none();
   * expect(x.or(y)).toStrictEqual(Option.some(2));
   * @example Returns `y` since `x` doesn't contain a value.
   * const x = Option.none();
   * const y = Option.some(100);
   * expect(x.or(y)).toStrictEqual(Option.some(100));
   * @example Returns `x` since `x` contains a value.
   * const x = Option.some(2);
   * const y = Option.some(100);
   * expect(x.or(y)).toStrictEqual(Option.some(2));
   * @example Returns **None** since neither `x` nor `y` contain a value.
   * const x = Option.none();
   * const y = Option.none();
   * expect(x.or(y)).toStrictEqual(Option.none());
   * @param other An option of type T.
   * @returns An option of type T.
   */
  public or(other: Option<T>): Option<T> {
    return this.match(
      () => this,
      () => other
    );
  }

  /**
   * Zips `self` with another `Option`.
   *
   * If `self` is `Some(s)` and `other` is `Some(o)`, this method returns `Some([s, o])`.
   * Otherwise, `None` is returned.
   *
   * ### Examples
   * @example
   * const x = Option.some(1);
   * const y = Option.some("hi");
   * const z = Option.none();
   *
   * expect(x.zip(y)).toStrictEqual(Option.some([1, "hi"]));
   * expect(x.zip(z)).toStrictEqual(Option.none());
   * @param other An option of type U.
   * @returns An option of type [T, U].
   */
  public zip<U>(other: Option<U>): Option<[T, U]> {
    return this.match(
      (value) => other.map((otherValue) => [value, otherValue]),
      () => new None()
    );
  }

  /**
   * Unzips an option containing a tuple of two options into two separate options.
   *
   * If `this` is `Some((a, b))`, this method returns `[Some(a), Some(b)]`.
   * Otherwise, `[None, None]` is returned.
   *
   * ### Examples
   * @example
   * const x = Option.some([1, "hi"]);
   * const [y, z] = x.unzip();
   * expect(y).toStrictEqual(Option.some(1));
   * expect(z).toStrictEqual(Option.some("hi"));
   *
   * const x = Option.none();
   * const [y, z] = x.unzip();
   * expect(y).toStrictEqual(Option.none());
   * expect(z).toStrictEqual(Option.none());
   * @returns An array of options.
   */
  public unzip<A, B>(this: Option<[A, B]>): [Option<A>, Option<B>] {
    if (this.isSome()) {
      return [new Some(this.value[0]), new Some(this.value[1])];
    }

    return [new None(), new None()];
  }

  /**
   * Converts from `Option<Option<T>>` to `Option<T>`.
   *
   * ### Examples
   * @example
   * const x = Option.some(Option.some("foo"));
   * expect(x.flatMap(identity)).toStrictEqual(Option.some("foo"));
   * @param fn A function that returns an option of type T.
   * @returns An option of type T.
   */
  public flatMap<U>(fn: (value: T) => Option<U>): Option<U> {
    return this.match(fn, () => new None());
  }
}

/**
 * Represents a value of type T.
 * This is the **Some** variant of the **Option** type, that means that it contains a value.
 */
export class Some<T> extends Option<T> {
  private readonly _value: T;

  constructor(value: T) {
    super();
    this._value = value;
  }

  public get value() {
    return this._value;
  }
}

export class None<T> extends Option<T> {}
