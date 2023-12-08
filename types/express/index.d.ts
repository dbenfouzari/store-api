import type { TokenPayload } from "@auth/application/services/IJWTService";
import type { User } from "@auth/domain/entities/User";

declare global {
  namespace Express {
    export interface Request {
      user?: TokenPayload;
    }
  }
}

declare module "express-serve-static-core" {
  interface Request {
    user?: User;
  }
}
