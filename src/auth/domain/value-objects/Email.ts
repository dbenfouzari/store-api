import type { Option } from "@shared/common/Option";
import type { Result } from "@shared/common/Result";

import { None, Some } from "@shared/common/Option";
import { Err, Ok } from "@shared/common/Result";
import { ValueObject } from "@shared/domain/models/ValueObject";

type EmailProps = {
  value: string;
};

export enum EmailExceptions {
  IncorrectFormat = "EmailIncorrectFormat",
}

export class Email extends ValueObject<EmailProps> {
  static create(value: string): Result<Email, EmailExceptions> {
    const validatedValue = this.validate(value);

    return validatedValue.match(
      (value) => Ok.of(new Email({ value })),
      () => Err.of(EmailExceptions.IncorrectFormat)
    );
  }

  static validate(value: string): Option<string> {
    const regex = new RegExp(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ //NOSONAR
    );

    if (regex.test(value)) {
      return Some.of(value);
    }

    return new None();
  }
}
