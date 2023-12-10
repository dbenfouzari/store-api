import type { Result } from "@shared/common/Result";

import { Err, Ok } from "@shared/common/Result";
import { ValueObject } from "@shared/domain/models/ValueObject";

import { PriceFormat } from "../enums/PriceFormat";

type PriceProps = {
  value: number;
};

export enum PriceExceptions {
  MustBeGreaterThanZero = "PriceMustBeGreaterThanZero",
}

/**
 * A price is a value object that represents a monetary value.
 */
export class Price extends ValueObject<PriceProps> {
  /**
   * Constructor is private because the only way to create a price is by using the static factory method.
   * @param props The properties of the price.
   */
  private constructor(props: PriceProps) {
    super(props);
  }

  /**
   * The static factory method to create a price.
   * @param price The price in cents.
   * @returns A price.
   */
  public static create(price: number): Result<Price, PriceExceptions> {
    const isAmountValid = this.validateAmount(price);

    if (!isAmountValid) {
      return Err.of(PriceExceptions.MustBeGreaterThanZero);
    }

    return Ok.of(new this({ value: price }));
  }

  /**
   * Get the price in cents.
   * @returns The price in cents.
   */
  public get asCents() {
    return this.props.value;
  }

  /**
   * Get the price in unit.
   *
   * It can be used to get the price in dollars, for example,
   * since the unit of the price is cents.
   * @returns The price in dollars.
   */
  public get asUnit() {
    return this.props.value / 100;
  }

  /**
   * Get the price as a string.
   * @param format The format of the price.
   * @param locale The locale to use.
   * @param currency The currency to use.
   * @returns The price as a string.
   */
  public toString(
    format: PriceFormat = PriceFormat.LONG,
    locale: string = "en-US",
    currency: string = "USD"
  ) {
    const minimumFractionDigits = format === PriceFormat.SHORT ? 0 : 2;

    return Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 2,
      minimumFractionDigits: minimumFractionDigits,
    }).format(this.asUnit);
  }

  private static validateAmount(amount: number) {
    return amount >= 0;
  }
}
