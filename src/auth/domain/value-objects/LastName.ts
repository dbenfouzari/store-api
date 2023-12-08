import { Option } from "@shared/common/Option";
import { Result } from "@shared/common/Result";
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
      (value) => Result.ok(new LastName({ value })),
      () => Result.fail(LastNameExceptions.TooShort)
    );
  }

  static validate(value: string): Option<string> {
    if (value.length < 2) {
      return Option.none();
    }

    return Option.some(value);
  }
}
