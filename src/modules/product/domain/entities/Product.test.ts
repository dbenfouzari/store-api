import { Product } from "./Product";

describe("Product", () => {
  it("should create a product with variants", () => {
    const variants = [
      {
        name: "Default",
        description: "Default variant",
        price: 0,
      },
      {
        name: "Variant 1",
        description: "Variant 1",
        price: 100,
      },
    ];

    const product = Product.create({
      name: "Product",
      variants,
    });

    expect(product.isSuccess).toBe(true);
  });

  it("should create a product with a default variant", () => {
    const product = Product.create({ name: "Product" });

    expect(product.isSuccess).toBe(true);
  });

  it("should create a default variant if no variants are provided", () => {
    const product = Product.create({ name: "Product" });

    expect(product.value.props.variants.size).toBe(1);
  });

  it("should have correct name", () => {
    const product = Product.create({
      name: "Product",
    });

    expect(product.value.props.name.props.value).toBe("Product");
  });

  it("should fail if one of the variants is invalid", () => {
    const variants = [
      {
        name: "Default",
        description: "Default variant",
        price: 0,
      },
      {
        name: "Variant 1",
        description: "Variant 1",
        price: -100,
      },
    ];

    const product = Product.create({
      name: "Product",
      variants,
    });

    expect(product.isFailure).toBe(true);
  });

  it("should fail if the name is invalid", () => {
    const product = Product.create({
      name: "",
    });

    expect(product.isFailure).toBe(true);
  });
});
