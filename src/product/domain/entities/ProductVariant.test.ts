import { ProductVariant, ProductVariantExceptions } from "./ProductVariant";

describe("Product Variant", () => {
  describe("with valid data", () => {
    const variantResult = ProductVariant.create({
      name: "Default Variant",
      description: "Default Variant Description",
      price: 2000,
    });

    const variant = variantResult.unwrap();

    it("should have correct name value", () => {
      expect(variant.props.name).toBe("Default Variant");
    });

    it("should have correct price value", () => {
      expect(variant.props.price.asCents).toBe(2000);
    });

    it("should have correct description value", () => {
      expect(variant.props.description).toBe("Default Variant Description");
    });
  });

  describe("with invalid data", () => {
    it("should not create a variant with empty name", () => {
      const variantResult = ProductVariant.create({
        name: "",
        description: "Default Variant Description",
        price: 2000,
      });

      expect(variantResult.unwrapErr()).toBe(ProductVariantExceptions.NameLength);
    });

    it.each`
      name
      ${"a"}
      ${"aa"}
      ${"A product variant with a very long name"}
    `("should not create a variant with name $name", ({ name }) => {
      const variantResult = ProductVariant.create({
        name,
        description: "Default Variant Description",
        price: 2000,
      });

      expect(variantResult.unwrapErr()).toBe(ProductVariantExceptions.NameLength);
    });
  });
});
