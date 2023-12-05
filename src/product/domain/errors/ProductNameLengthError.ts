import { ProductDomainError } from "./ProductDomainError";

export class ProductNameLengthError extends ProductDomainError {
  constructor() {
    super("The name must be 2-20 characters long.");
    this.name = "ProductNameLengthError";
  }
}
