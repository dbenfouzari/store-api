import { Identifier } from "./Identifier";

describe("identifier", () => {
  it("should create an identifier", () => {
    const identifier = new Identifier(Symbol.for("Vitest"));

    expect(identifier.toValue()).toStrictEqual(Symbol.for("Vitest"));
  });

  it("should be able to compare equality", () => {
    const identifier1 = new Identifier(1);
    const identifier2 = new Identifier(2);
    const identifier1Bis = new Identifier(1);

    expect(identifier1.equals(identifier1Bis)).toBe(true);
    expect(identifier1.equals(identifier2)).toBe(false);
    expect(identifier1.equals(null)).toBe(false);
    expect(identifier1.equals(undefined)).toBe(false);
    // @ts-expect-error Because we want to catch other types inequality
    expect(identifier1.equals(1)).toBe(false);
  });

  it("should return correct implementation as string when input is number", () => {
    const identifier = new Identifier(1);

    expect(identifier.toValue()).toBe(1);
    expect(identifier.toString()).toBe("1");
  });

  it("should return correct implementation as string when input is string", () => {
    const identifier = new Identifier("vitest");

    expect(identifier.toValue()).toBe("vitest");
    expect(identifier.toString()).toBe("vitest");
  });

  it("should return correct implementation as string when input is symbol", () => {
    const identifier = new Identifier(Symbol.for("Vitest"));

    expect(identifier.toValue()).toStrictEqual(Symbol.for("Vitest"));
    expect(identifier.toString()).toBe("Symbol(Vitest)");
  });
});
