import { ProductDomainError } from "./ProductDomainError";

export class PriceShouldBeGreaterThanZeroError extends ProductDomainError {
  public static message = "The price should be greater than zero.";

  constructor() {
    super(PriceShouldBeGreaterThanZeroError.message);
  }
}
