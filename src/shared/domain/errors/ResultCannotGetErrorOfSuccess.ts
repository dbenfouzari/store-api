import { DomainError } from "@shared/domain/errors/DomainError";

export class ResultCannotGetErrorOfSuccess extends DomainError {
  constructor(message = "Cannot get error of a success result.") {
    super(message);
    this.name = "ResultCannotGetErrorOfSuccess";
  }
}
