import { AppException } from "@application/exceptions/AppException";

export class UseCaseException extends AppException {
  constructor(message: string) {
    super(message);
    this.name = "UseCaseException";
  }
}
