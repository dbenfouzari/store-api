/**
 * A domain error is an error that occurs in the domain layer.
 * It is used to communicate errors between the domain layer and the application layer.
 */
export class DomainError extends Error {
  constructor(message: string, name = "DomainError") {
    super(message);
    this.name = name;
  }
}
