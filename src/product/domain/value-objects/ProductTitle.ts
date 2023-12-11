import type { Result } from "@shared/common/Result";

import { Err, Ok } from "@shared/common/Result";
import { ValueObject } from "@shared/domain/models/ValueObject";

type ProductTitleProps = {
  value: string;
};

export enum ProductTitleExceptions {
  Length = "The product title must be between 3 and 20 characters.",
}

export class ProductTitle extends ValueObject<ProductTitleProps> {
  private constructor(props: ProductTitleProps) {
    super(props);
  }

  static create(title: string): Result<ProductTitle, ProductTitleExceptions> {
    const isValid = this.validate(title);

    if (!isValid) {
      return Err.of(ProductTitleExceptions.Length);
    }

    return Ok.of(new this({ value: title }));
  }

  private static validate(value: string) {
    return !(value.length < 3 || value.length > 20);
  }
}
