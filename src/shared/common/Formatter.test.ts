import { Formatter } from "@shared/common/Formatter";

describe("formatter", () => {
  it("should format null", () => {
    const result = Formatter.toStringDebug(null);

    expect(result).toBeNull();
  });

  it("should format undefined", () => {
    const result = Formatter.toStringDebug(undefined);

    expect(result).toBeUndefined();
  });

  it("should format a string", () => {
    const result = Formatter.toStringDebug("Hello");

    expect(result).toBe('"Hello"');
  });

  it("should format a number", () => {
    const result = Formatter.toStringDebug(42);

    expect(result).toBe(42);
  });

  it("should format a boolean", () => {
    const result = Formatter.toStringDebug(true);

    expect(result).toBe(true);
  });

  it("should format an anonymous function", () => {
    const result = Formatter.toStringDebug(() => {});

    expect(result).toBe("Function anonymous()");
  });

  it("should format an named function", () => {
    const result = Formatter.toStringDebug(function sayHello() {});

    expect(result).toBe("Function sayHello()");
  });

  it("should format a date", () => {
    const result = Formatter.toStringDebug(new Date(1991, 10, 21));

    expect(result).toBe("1991-11-21T00:00:00.000Z");
  });

  it("should format an object with `toString()` method", () => {
    const result = Formatter.toStringDebug({ toString: () => "hello" });

    expect(result).toBe('"hello"');
  });
});
