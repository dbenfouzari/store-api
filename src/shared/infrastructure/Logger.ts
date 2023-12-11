import type { IAppLogger } from "@shared/application/IAppLogger";

import chalk from "chalk";
import { inject, injectable } from "tsyringe";

import { LoggingLevel } from "@shared/application/IAppLogger";
import { SharedTokens } from "@shared/di/tokens";

@injectable()
export class Logger implements IAppLogger {
  private _message: string = "";

  constructor(@inject(SharedTokens.LoggerMode) readonly mode: LoggingLevel) {
    this.debug(`Logger mode is set to ${mode}`);
  }

  private print(loggingMode: LoggingLevel, message: string): void {
    const timestamp = this.getTimestamp();
    const coloredTimestamp = chalk.white(timestamp);

    const loggingModeString = (() => {
      switch (loggingMode) {
        case LoggingLevel.DEBUG:
          return "[DEBUG]";
        case LoggingLevel.INFO:
          return "[INFO]";
        case LoggingLevel.WARN:
          return "[WARN]";
        case LoggingLevel.ERROR:
          return "[ERROR]";
        default:
          return "[TRACE]";
      }
    })();

    const loggingModeWrapped = loggingModeString.padEnd(10, " ");

    const coloredLevel = () => {
      switch (loggingMode) {
        case LoggingLevel.DEBUG:
          return chalk.blue;
        case LoggingLevel.INFO:
          return chalk.green;
        case LoggingLevel.WARN:
          return chalk.yellow;
        case LoggingLevel.ERROR:
          return chalk.red.bold;
        default:
          return chalk.white;
      }
    };

    console.log(`${coloredLevel()(loggingModeWrapped)} ${coloredTimestamp} ${message}`);
  }

  /**
   * The lowest logging level. Used for logging everything.
   * Designates finer-grained informational events than the DEBUG.
   * Designates very low priority, often extremely verbose, information.
   * @param message The message to log.
   */
  public trace(message: string): void {
    this._message = message;
    if (this.shouldLogTrace()) {
      this.print(LoggingLevel.TRACE, this._message);
    }
  }

  /**
   * Designates fine-grained informational events that are most useful to debug an application.
   * Designates lower priority information.
   * @param message The message to log.
   */
  public debug(message: string): void {
    this._message = message;
    if (this.shouldLogDebug()) {
      this.print(LoggingLevel.DEBUG, this._message);
    }
  }

  /**
   * Designates informational messages that highlight the progress of the application at coarse-grained level.
   * Designates useful information.
   * @param message The message to log.
   */
  public info(message: string): void {
    this._message = message;
    if (this.shouldLogLog()) {
      this.print(LoggingLevel.INFO, this._message);
    }
  }

  /**
   * Designates error events that might still allow the application to continue running.
   * Designates potentially harmful situations.
   * Designates hazardous situations.
   * @param message The message to log.
   */
  public warn(message: string): void {
    this._message = message;
    if (this.shouldLogWarn()) {
      this.print(LoggingLevel.WARN, this._message);
    }
  }

  /**
   * The highest logging level. Used for logging errors.
   * Designates very severe error events that will presumably lead the application to abort.
   * @param message The message to log.
   */
  public error(message: string): void {
    this._message = message;
    if (this.shouldLogError()) {
      this.print(LoggingLevel.ERROR, this._message);
    }
  }

  private shouldLogTrace(): boolean {
    return [LoggingLevel.TRACE].includes(this.mode);
  }

  private shouldLogDebug(): boolean {
    return [LoggingLevel.TRACE, LoggingLevel.DEBUG].includes(this.mode);
  }

  private shouldLogLog(): boolean {
    return [LoggingLevel.TRACE, LoggingLevel.DEBUG, LoggingLevel.INFO].includes(
      this.mode
    );
  }

  private shouldLogWarn(): boolean {
    return [
      LoggingLevel.TRACE,
      LoggingLevel.DEBUG,
      LoggingLevel.INFO,
      LoggingLevel.WARN,
    ].includes(this.mode);
  }

  private shouldLogError(): boolean {
    return [
      LoggingLevel.TRACE,
      LoggingLevel.DEBUG,
      LoggingLevel.INFO,
      LoggingLevel.WARN,
      LoggingLevel.ERROR,
    ].includes(this.mode);
  }

  private getTimestamp(): string {
    return Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
    }).format(new Date());
  }
}
