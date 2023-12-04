import { DomainError } from "@shared/domain/errors/DomainError";

export class ResultCannotGetErrorOfSuccess extends DomainError {
  constructor() {
    super("Cannot get error of a success result.");
    this.name = "ResultCannotGetErrorOfSuccess";
  }
}
