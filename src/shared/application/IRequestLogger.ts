import type { RequestHandler } from "express";

export type LogRequestOptions = {
  logBody?: boolean;
};

export interface IRequestLogger {
  logRequest: (options: LogRequestOptions) => RequestHandler;
}
