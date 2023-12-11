import { LoggingLevel } from "@shared/application/IAppLogger";

/**
 * Returns a LoggerMode from a string.
 * It can be used to parse the LOGGER_MODE environment variable.
 * If the string is not a valid LoggerMode, it returns LoggerMode.INFO.
 * @example
 * getLoggerModeFromString("verbose") // returns LoggerMode.VERBOSE
 * getLoggerModeFromString("debug") // returns LoggerMode.DEBUG
 * getLoggerModeFromString("info") // returns LoggerMode.INFO
 * getLoggerModeFromString("warn") // returns LoggerMode.WARN
 * getLoggerModeFromString("error") // returns LoggerMode.ERROR
 * getLoggerModeFromString("invalid") // returns LoggerMode.INFO
 * @param mode The string to parse.
 * @returns The LoggerMode parsed from the string.
 */
export function getLoggerModeFromString(mode?: string): LoggingLevel {
  switch (mode?.toLowerCase()) {
    case "trace":
      return LoggingLevel.TRACE;
    case "debug":
      return LoggingLevel.DEBUG;
    case "info":
      return LoggingLevel.INFO;
    case "warn":
      return LoggingLevel.WARN;
    case "error":
      return LoggingLevel.ERROR;
    default:
      return LoggingLevel.INFO;
  }
}
