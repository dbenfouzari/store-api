type HasToStringMethod = Record<"toString", () => string>;

export class Formatter {
  public static toStringDebug<T>(value: T) {
    if (typeof value === "boolean") return value;
    if (typeof value === "number") return value;
    if (typeof value === "string") return `"${value}"`;
    if (typeof value === "function") return `Function ${value.name || "anonymous"}()`;

    if (value instanceof Date) return value.toISOString();

    if (Formatter.hasToStringMethod(value)) {
      return `"${value.toString()}"`;
    }

    return value;
  }

  private static hasToStringMethod(value: unknown): value is HasToStringMethod {
    return typeof (value as HasToStringMethod)?.toString === "function";
  }
}
