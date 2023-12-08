import type { Option } from "@shared/common/Option";

export interface IJWTService<Payload extends Record<string, unknown>> {
  sign(payload: Payload): string;
  verify(token: string): Option<Payload>;
}
