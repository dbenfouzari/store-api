import type { Result } from "@shared/common/Result";

import { Err, Ok } from "@shared/common/Result";
import { ValueObject } from "@shared/domain/models/ValueObject";

import { ProductNameLengthError } from "../errors/ProductNameLengthError";

type ProductTitleProps = {
  value: string;
};

export class ProductTitle extends ValueObject<ProductTitleProps> {
  private constructor(props: ProductTitleProps) {
    super(props);
  }

  static create(title: string): Result<ProductTitle, ProductNameLengthError> {
    const isValid = this.validate(title);

    if (!isValid) {
      return Err.of(new ProductNameLengthError());
    }

    return Ok.of(new this({ value: title }));
  }

  private static validate(value: string) {
    return !(value.length < 3 || value.length > 20);
  }
}
