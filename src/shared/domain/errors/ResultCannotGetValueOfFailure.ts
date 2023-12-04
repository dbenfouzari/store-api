import { DomainError } from "@shared/domain/errors/DomainError";

export class ResultCannotGetValueOfFailure extends DomainError {
  constructor() {
    super("Cannot get value of a failure result.");
    this.name = "ResultCannotGetValueOfFailure";
  }
}
