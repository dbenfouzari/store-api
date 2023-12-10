import type { Either } from "@shared/common/Either";
import type { Option } from "@shared/common/Option";
import type { Result } from "@shared/common/Result";
import type { DateTimeExceptions } from "@shared/domain/value-objects/DateTime";

import { Err, Ok } from "@shared/common/Result";
import { ValueObject } from "@shared/domain/models/ValueObject";
import { DateTime } from "@shared/domain/value-objects/DateTime";

export enum CartUpdateDateExceptions {
  MustBeInThePast = "CartUpdateDateMustBeInThePast",
}

export class CartUpdateDate extends ValueObject<{ value: DateTime }> {
  static create(
    value: Option<Either<DateTime, string>>
  ): Result<CartUpdateDate, CartUpdateDateExceptions | DateTimeExceptions> {
    const dateTimeOrException = value.match(
      (eitherDateTimeOrString) =>
        eitherDateTimeOrString.match(
          (dateTime) => dateTime,
          (string) =>
            DateTime.parse(string).match<DateTimeExceptions | DateTime>(
              (exception) => exception,
              (dateTime) => dateTime
            )
        ),
      () => DateTime.now()
    );

    if (dateTimeOrException instanceof DateTime) {
      const result = this.checkDateIsInThePast(dateTimeOrException);

      return result.match(
        (dateTime) => Ok.of(new CartUpdateDate({ value: dateTime })),
        (error) => Err.of(error)
      );
    }

    return Err.of(dateTimeOrException);
  }

  private static checkDateIsInThePast(
    dateTime: DateTime
  ): Result<DateTime, CartUpdateDateExceptions> {
    const isValid = dateTime.isSameOrBefore(DateTime.now());

    if (!isValid) {
      return Err.of(CartUpdateDateExceptions.MustBeInThePast);
    }

    return Ok.of(dateTime);
  }
}
