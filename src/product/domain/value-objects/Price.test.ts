import { PriceFormat } from "../enums/PriceFormat";

import { Price } from "./Price";

describe("Price", () => {
  const price = Price.create(2000);

  it("should create a price", () => {
    expect(price).toBeDefined();
  });

  it("should have correct value", () => {
    expect(price.value.props.value).toBe(2000);
  });

  it("should correctly give price as cents", () => {
    expect(price.value.asCents).toBe(2000);
  });

  it("should correctly give price as unit", () => {
    expect(price.value.asUnit).toBe(20);
  });

  it("should correctly give price as string", () => {
    expect(price.value.toString()).toBe("$20.00");
  });

  it("should correctly give price as short string", () => {
    expect(price.value.toString(PriceFormat.SHORT)).toBe("$20");
  });

  it("should correctly give price as string with different locale", () => {
    expect(price.value.toString(PriceFormat.LONG, "fr-FR", "EUR")).toBe("20,00 €");
  });

  it("should correctly give price as short string with different locale", () => {
    expect(price.value.toString(PriceFormat.SHORT, "fr-FR", "EUR")).toBe("20 €");
  });
});
