// noinspection JSUnusedGlobalSymbols

export class UnexpectedAppError extends Error {
  static message = "An unexpected error occurred";

  constructor() {
    super(UnexpectedAppError.message);
  }
}
