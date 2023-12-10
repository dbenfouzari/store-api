import { DomainError } from "@shared/domain/errors/DomainError";

export class ResultCannotGetValueOfFailure extends DomainError {
  constructor(message: string = "Cannot get value of a failure result.") {
    super(message);
    this.name = "ResultCannotGetValueOfFailure";
  }
}
