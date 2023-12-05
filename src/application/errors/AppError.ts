/**
 * An error that is thrown by the application.
 *
 * An error is a type of exception that is not expected to be caught and handled.
 * It is used to signal that something unexpected happened.
 * It is not used to signal that something expected happened.
 * @see AppException
 */
export class AppError extends Error {}
