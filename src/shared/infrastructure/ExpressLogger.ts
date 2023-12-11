import type {
  IRequestLogger,
  LogRequestOptions,
} from "@shared/application/IRequestLogger";
import type { RequestHandler } from "express";

import chalk from "chalk";
import onFinished from "on-finished";
import { injectable } from "tsyringe";

@injectable()
export class ExpressLogger implements IRequestLogger {
  logRequest =
    (options: LogRequestOptions): RequestHandler =>
    (req, res, next) => {
      const start = Date.now();
      const method = req.method;
      const url = req.originalUrl;

      onFinished(res, (err, response) => {
        const timeElapsed = Date.now() - start;
        const code = response.statusCode;

        const coloredMethod = this.getColoredMethod(method);
        const coloredStatusCode = this.getColoredStatusCode(code);
        const coloredTimeElapsed = this.getColoredTimeElapsed(timeElapsed);

        console.log(
          `${coloredMethod} ${chalk.gray(url)} ${coloredStatusCode} ${coloredTimeElapsed}`
        );

        if (options.logBody) {
          console.log("↪ Request body:");
          console.table(req.body);
        }
      });

      next();
    };

  private getColoredMethod(method: string) {
    switch (method) {
      case "GET":
      default:
        return chalk.gray.bold(method);
      case "POST":
        return chalk.green.bold(method);
      case "PUT":
        return chalk.yellow.bold(method);
      case "DELETE":
        return chalk.red.bold(method);
    }
  }

  private getColoredStatusCode(statusCode: number) {
    switch (true) {
      case statusCode >= 200 && statusCode < 300:
      default:
        return chalk.green(statusCode);
      case statusCode >= 300 && statusCode < 400:
        return chalk.yellow(statusCode);
      case statusCode >= 400 && statusCode < 500:
        return chalk.yellow.bold(statusCode);
      case statusCode >= 500:
        return chalk.red.bold(statusCode);
    }
  }

  private getColoredTimeElapsed(timeElapsed: number) {
    switch (true) {
      case timeElapsed < 100:
      default:
        return chalk.gray(`${timeElapsed}ms`);
      case timeElapsed < 500:
        return chalk.yellow(`${timeElapsed}ms`);
      case timeElapsed >= 500:
        return chalk.red(`${timeElapsed}ms`);
    }
  }
}
