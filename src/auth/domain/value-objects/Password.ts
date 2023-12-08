import { Result } from "@shared/common/Result";
import { ValueObject } from "@shared/domain/models/ValueObject";

type PasswordProps = {
  value: string;
};

export enum PasswordExceptions {
  TooShort = "PasswordTooShort",
  MustHaveAtLeastOneNumber = "PasswordMustHaveAtLeastOneNumber",
  MustHaveAtLeastOneUpperCaseLetter = "PasswordMustHaveAtLeastOneUpperCaseLetter",
  MustHaveAtLeastOneLowerCaseLetter = "PasswordMustHaveAtLeastOneLowerCaseLetter",
  MustHaveAtLeastOneSpecialCharacter = "PasswordMustHaveAtLeastOneSpecialCharacter",
}

export class Password extends ValueObject<PasswordProps> {
  static create(value: string): Result<Password, PasswordExceptions> {
    const lengthResult = Password.validateLength(value);
    const hasAtLeastOneNumberResult = Password.validateHasAtLeastOneNumber(value);
    const hasAtLeastOneUpperCaseLetterResult =
      Password.validateHasAtLeastOneUpperCaseLetter(value);
    const hasAtLeastOneLowerCaseLetterResult =
      Password.validateHasAtLeastOneLowerCaseLetter(value);
    const hasAtLeastOneSpecialCharacterResult =
      Password.validateHasAtLeastOneSpecialCharacter(value);

    const result = Result.combine(
      lengthResult,
      hasAtLeastOneNumberResult,
      hasAtLeastOneUpperCaseLetterResult,
      hasAtLeastOneLowerCaseLetterResult,
      hasAtLeastOneSpecialCharacterResult
    );

    if (result.isFailure) {
      return Result.fail(result.error);
    }

    return Result.ok(new Password({ value }));
  }

  static validateLength(value: string): Result<string, PasswordExceptions.TooShort> {
    if (value.length < 8) {
      return Result.fail(PasswordExceptions.TooShort);
    }

    return Result.ok(value);
  }

  static validateHasAtLeastOneNumber(
    value: string
  ): Result<string, PasswordExceptions.MustHaveAtLeastOneNumber> {
    if (!/\d/.test(value)) {
      return Result.fail(PasswordExceptions.MustHaveAtLeastOneNumber);
    }

    return Result.ok(value);
  }

  static validateHasAtLeastOneUpperCaseLetter(
    value: string
  ): Result<string, PasswordExceptions.MustHaveAtLeastOneUpperCaseLetter> {
    if (!/[A-Z]/.test(value)) {
      return Result.fail(PasswordExceptions.MustHaveAtLeastOneUpperCaseLetter);
    }

    return Result.ok(value);
  }

  static validateHasAtLeastOneLowerCaseLetter(
    value: string
  ): Result<string, PasswordExceptions.MustHaveAtLeastOneLowerCaseLetter> {
    if (!/[a-z]/.test(value)) {
      return Result.fail(PasswordExceptions.MustHaveAtLeastOneLowerCaseLetter);
    }

    return Result.ok(value);
  }

  static validateHasAtLeastOneSpecialCharacter(
    value: string
  ): Result<string, PasswordExceptions.MustHaveAtLeastOneSpecialCharacter> {
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      return Result.fail(PasswordExceptions.MustHaveAtLeastOneSpecialCharacter);
    }

    return Result.ok(value);
  }
}
