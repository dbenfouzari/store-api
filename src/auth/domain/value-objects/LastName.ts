import type { Option } from "@shared/common/Option";
import type { Result } from "@shared/common/Result";

import { None, Some } from "@shared/common/Option";
import { Err, Ok } from "@shared/common/Result";
import { ValueObject } from "@shared/domain/models/ValueObject";

type LastNameProps = {
  value: string;
};

export enum LastNameExceptions {
  TooShort = "LastNameTooShort",
}

export class LastName extends ValueObject<LastNameProps> {
  static create(value: string): Result<LastName, LastNameExceptions> {
    const validatedValue = this.validate(value);

    return validatedValue.match(
      (value) => Ok.of(new LastName({ value })),
      () => Err.of(LastNameExceptions.TooShort)
    );
  }

  static validate(value: string): Option<string> {
    if (value.length < 2) {
      return new None();
    }

    return Some.of(value);
  }
}
