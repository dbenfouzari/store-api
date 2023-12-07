import type { Either } from "@shared/common/Either";
import type { Option } from "@shared/common/Option";
import type { DateTimeExceptions } from "@shared/domain/value-objects/DateTime";

import { Result } from "@shared/common/Result";
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
        (error) => Result.fail(error),
        (dateTime) => Result.ok(new CartUpdateDate({ value: dateTime }))
      );
    }

    return Result.fail(dateTimeOrException);
  }

  private static checkDateIsInThePast(
    dateTime: DateTime
  ): Result<DateTime, CartUpdateDateExceptions> {
    const isValid = dateTime.isSameOrBefore(DateTime.now());

    if (!isValid) {
      return Result.fail(CartUpdateDateExceptions.MustBeInThePast);
    }

    return Result.ok(dateTime);
  }
}
