import { Option } from "@shared/common/Option";
import { Result } from "@shared/common/Result";
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
      (value) => Result.ok(new FirstName({ value })),
      () => Result.fail(FirstNameExceptions.TooShort)
    );
  }

  static validate(value: string): Option<string> {
    if (value.length < 2) {
      return Option.none();
    }

    return Option.some(value);
  }
}
