import { UseCaseException } from "@application/exceptions/UseCaseException";

export class CartNotFoundException extends UseCaseException {
  constructor() {
    super("Cart not found");
    this.name = "CartNotFoundException";
  }
}
