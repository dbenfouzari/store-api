/* eslint-disable @typescript-eslint/no-explicit-any */

export class Result<T> {
  public readonly isSuccess: boolean;
  public readonly isFailure: boolean;
  private readonly error: string;
  private readonly _value: T;

  protected constructor(isSuccess: boolean, error: string = "", value?: T) {
    if (isSuccess && error) {
      throw new Error(
        "InvalidOperation: A result cannot be successful and contain an error."
      );
    }
    if (!isSuccess && !error) {
      throw new Error(
        "InvalidOperation: A failing result needs to contain an error message."
      );
    }

    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    this.error = error;
    this._value = value as T;

    Object.freeze(this);
  }

  public getValue(): T {
    if (this.isFailure) {
      throw new Error(
        "Can't get the value of an error result. Use `getErrorValue` instead."
      );
    }

    return this._value;
  }

  public getErrorValue() {
    return this.error;
  }

  public static ok<U>(value?: U): Result<U> {
    return new Result<U>(true, "", value);
  }

  public static fail<U>(error: string) {
    return new Result<U>(false, error);
  }

  public static combine(...results: Result<any>[]) {
    for (const result of results) {
      if (result.isFailure) {
        return result;
      }
    }

    return Result.ok<any>();
  }
}
