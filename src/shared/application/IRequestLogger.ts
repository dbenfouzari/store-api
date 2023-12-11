import type { RequestHandler } from "express";

export type LogRequestOptions = {
  logBody?: boolean;
  logHeaders?: boolean;
  logQuery?: boolean;
  logParams?: boolean;
};

export interface IRequestLogger {
  logRequest: (options?: LogRequestOptions) => RequestHandler;
}
