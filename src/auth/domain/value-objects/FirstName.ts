import type { Option } from "@shared/common/Option";
import type { Result } from "@shared/common/Result";

import { None, Some } from "@shared/common/Option";
import { Err, Ok } from "@shared/common/Result";
import { ValueObject } from "@shared/domain/models/ValueObject";

type FirstNameProps = {
  value: string;
};

export enum FirstNameExceptions {
  TooShort = "FirstNameTooShort",
}

export class FirstName extends ValueObject<FirstNameProps> {
  static create(value: string): Result<FirstName, FirstNameExceptions> {
    const validatedValue = this.validate(value);

    return validatedValue.match(
      (value) => Ok.of(new FirstName({ value })),
      () => Err.of(FirstNameExceptions.TooShort)
    );
  }

  static validate(value: string): Option<string> {
    if (value.length < 2) {
      return new None();
    }

    return Some.of(value);
  }
}
