import type { User } from "@auth/domain/entities/User";

declare global {
  namespace Express {
    export interface Request {
      user?: User;
    }
  }
}

declare module "express-serve-static-core" {
  interface Request {
    user?: User;
  }
}
