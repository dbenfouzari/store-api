import { ResultCannotGetErrorOfSuccess } from "@shared/domain/errors/ResultCannotGetErrorOfSuccess";
import { ResultCannotGetValueOfFailure } from "@shared/domain/errors/ResultCannotGetValueOfFailure";

export type ResultValue<T> = T extends Result<infer U, any> ? U : never;
export type ResultError<E> = E extends Result<any, infer U> ? U : never;

export class Result<T, E> {
  /** Stores the value of the result when it's successful. */
  private readonly _value: T;
  /** Stores the error of the result when it's a failure. */
  private readonly _error: E | undefined;

  /** Indicates whether the result is successful or not. */
  public readonly isSuccess: boolean;
  /** Indicates whether the result is a failure or not. */
  public readonly isFailure: boolean;

  //#region Constructors
  /**
   * Creates a new Result.
   * @param value The value of the result.
   * @param error The error of the result.
   * @returns A new successful result.
   */
  private constructor(value: T, error?: E) {
    this._value = value;
    this._error = error;

    this.isSuccess = !error;
    this.isFailure = !!error;
  }

  /**
   * Creates a new successful result.
   * @param value The value of the result.
   * @returns A new successful result.
   */
  public static ok<U, E>(value: U) {
    return new Result<U, E>(value);
  }

  /**
   * Creates a new failure result.
   * @param error The error of the result.
   * @returns A new failure result.
   */
  public static fail<U, E>(error: E) {
    return new Result<U, E>(undefined as U, error);
  }
  //#endregion

  //#region Static methods
  /**
   * Combines multiple results into one.
   * @param results The results to be combined.
   * @returns A new result.
   */
  public static combine<Args extends Result<any, any>[]>(
    ...results: Args
  ): Result<Args[number]["value"][], Args[number]["error"]> {
    for (const result of results) {
      if (result.isFailure) {
        return result;
      }
    }

    return Result.ok(results.map((result) => result.value));
  }
  //#endregion

  //#region Getters
  /**
   * Returns the value of the result.
   * @returns The value of the result.
   * @throws ResultCannotGetValueOfFailure An error if the result is a failure.
   */
  public get value(): T {
    if (this.isFailure) {
      throw new ResultCannotGetValueOfFailure();
    }

    return this._value;
  }

  /**
   * Returns the error of the result.
   * @returns The error of the result.
   * @throws ResultCannotGetErrorOfSuccess An error if the result is a success.
   */
  public get error(): E {
    if (this.isFailure && this._error) {
      return this._error;
    }

    throw new ResultCannotGetErrorOfSuccess();
  }
  //#endregion

  //#region Public methods
  /**
   * Matches the result with the given functions.
   * @param onFailure Callback to be executed when the result is a failure. Receives the error as a parameter.
   * @param onSuccess Callback to be executed when the result is a success. Receives the value as a parameter.
   * @returns The result of the executed callback.
   */
  public match<R>(onFailure: (error: E) => R, onSuccess: (value: T) => R): R {
    if (this.isFailure) {
      return onFailure(this._error as E);
    }

    return onSuccess(this._value);
  }

  /**
   * Matches the result with the given functions.
   * @param obj Object containing the callbacks to be executed.
   * @param obj.fail Callback to be executed when the result is a failure. Receives the error as a parameter.
   * @param obj.ok Callback to be executed when the result is a success. Receives the value as a parameter.
   * @returns The result of the executed callback.
   */
  public matchObj<R>({
    fail,
    ok,
  }: {
    fail?: (error: E) => R;
    ok?: (value: T) => R;
  }): R | undefined {
    if (this.isFailure) {
      return fail?.(this._error as E);
    }

    return ok?.(this._value);
  }
  //#endregion
}
