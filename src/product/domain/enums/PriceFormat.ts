/**
 * Price format enum.
 * Used to format the price as a string.
 */
export enum PriceFormat {
  /**
   * The short format.
   * It will display the price without the cents if there are no cents.
   * For example, $20 instead of $20.00.
   */
  SHORT = "SHORT",
  /**
   * The long format.
   * It will display the price with the cents.
   * For example, $20.00 instead of $20.
   */
  LONG = "LONG",
}
