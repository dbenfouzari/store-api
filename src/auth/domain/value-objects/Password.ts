import type { Result } from "@shared/common/Result";

import { Err, Ok } from "@shared/common/Result";
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

    return lengthResult.andThen(() =>
      hasAtLeastOneNumberResult.andThen(() =>
        hasAtLeastOneUpperCaseLetterResult.andThen(() =>
          hasAtLeastOneLowerCaseLetterResult.andThen(() =>
            hasAtLeastOneSpecialCharacterResult.andThen(() =>
              Ok.of(new Password({ value }))
            )
          )
        )
      )
    );
  }

  static validateLength(value: string): Result<string, PasswordExceptions.TooShort> {
    if (value.length < 8) {
      return Err.of(PasswordExceptions.TooShort);
    }

    return Ok.of(value);
  }

  static validateHasAtLeastOneNumber(
    value: string
  ): Result<string, PasswordExceptions.MustHaveAtLeastOneNumber> {
    if (!/\d/.test(value)) {
      return Err.of(PasswordExceptions.MustHaveAtLeastOneNumber);
    }

    return Ok.of(value);
  }

  static validateHasAtLeastOneUpperCaseLetter(
    value: string
  ): Result<string, PasswordExceptions.MustHaveAtLeastOneUpperCaseLetter> {
    if (!/[A-Z]/.test(value)) {
      return Err.of(PasswordExceptions.MustHaveAtLeastOneUpperCaseLetter);
    }

    return Ok.of(value);
  }

  static validateHasAtLeastOneLowerCaseLetter(
    value: string
  ): Result<string, PasswordExceptions.MustHaveAtLeastOneLowerCaseLetter> {
    if (!/[a-z]/.test(value)) {
      return Err.of(PasswordExceptions.MustHaveAtLeastOneLowerCaseLetter);
    }

    return Ok.of(value);
  }

  static validateHasAtLeastOneSpecialCharacter(
    value: string
  ): Result<string, PasswordExceptions.MustHaveAtLeastOneSpecialCharacter> {
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      return Err.of(PasswordExceptions.MustHaveAtLeastOneSpecialCharacter);
    }

    return Ok.of(value);
  }
}
