export enum LoggingLevel {
  /**
   * The highest logging level. Used for logging errors.
   * Designates very severe error events that will presumably lead the application to abort.
   */
  ERROR = "ERROR",
  /**
   * Designates error events that might still allow the application to continue running.
   * Designates potentially harmful situations.
   * Designates hazardous situations.
   */
  WARN = "WARN",
  /**
   * Designates informational messages that highlight the progress of the application at coarse-grained level.
   * Designates useful information.
   */
  INFO = "INFO",
  /**
   * Designates fine-grained informational events that are most useful to debug an application.
   * Designates lower priority information.
   */
  DEBUG = "DEBUG",
  /**
   * The lowest logging level. Used for logging everything.
   * Designates finer-grained informational events than the DEBUG.
   * Designates very low priority, often extremely verbose, information.
   */
  TRACE = "TRACE",
}

export interface IAppLogger {
  /**
   * Get the current logging level.
   */
  getLevel(): LoggingLevel;
  /**
   * The highest logging level. Used for logging errors.
   * Designates very severe error events that will presumably lead the application to abort.
   */
  error(message: string, ...rest: any[]): void;
  /**
   * Designates error events that might still allow the application to continue running.
   * Designates potentially harmful situations.
   * Designates hazardous situations.
   */
  warn(message: string, ...rest: any[]): void;
  /**
   * Designates informational messages that highlight the progress of the application at coarse-grained level.
   * Designates useful information.
   */
  info(message: string, ...rest: any[]): void;
  /**
   * Designates fine-grained informational events that are most useful to debug an application.
   * Designates lower priority information.
   */
  debug(message: string, ...rest: any[]): void;
  /**
   * The lowest logging level. Used for logging everything.
   * Designates finer-grained informational events than the DEBUG.
   * Designates very low priority, often extremely verbose, information.
   */
  trace(message: string, ...rest: any[]): void;
}
