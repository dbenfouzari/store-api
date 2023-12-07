import { AddProductVariantToCart } from "@cart/application/use-cases/AddProductVariantToCart";
import { Cart } from "@cart/domain/entities/Cart";
import { ProductVariant } from "product/domain/entities/ProductVariant";

import { Option } from "@shared/common/Option";

describe("AddProductVariantToCart", () => {
  const cart = Option.some(
    Cart.create({
      ownerId: "425fab45-27a2-451a-a506-9b2918658fe1",
    }).value
  );
  const productVariant = Option.some(
    ProductVariant.create({
      name: "name",
      price: 10,
    }).value
  );

  const cartReadRepositoryMock = {
    findCartByCartId: jest.fn().mockResolvedValue(cart),
    findCartByOwnerId: jest.fn().mockResolvedValue(cart),
  };

  const productVariantReadRepositoryMock = {
    findProductVariantByProductVariantId: jest.fn().mockResolvedValue(productVariant),
  };

  let addProductVariantToCart: AddProductVariantToCart;

  beforeEach(() => {
    addProductVariantToCart = new AddProductVariantToCart(
      cartReadRepositoryMock,
      productVariantReadRepositoryMock
    );
  });

  it("should return CartNotFound when cart is not found", async () => {
    jest
      .spyOn(cartReadRepositoryMock, "findCartByCartId")
      .mockReturnValueOnce(Option.none());

    const response = await addProductVariantToCart.execute({
      cartId: "cartId",
      productVariantId: "productVariantId",
    });

    expect(response.isFailure).toBe(true);
    expect(response.error).toBe("AddProductVariantToCartCartNotFound");
  });

  it("should return ProductVariantNotFound when product variant is not found", async () => {
    jest
      .spyOn(productVariantReadRepositoryMock, "findProductVariantByProductVariantId")
      .mockReturnValueOnce(Option.none());

    const response = await addProductVariantToCart.execute({
      cartId: "cartId",
      productVariantId: "productVariantId",
    });

    expect(response.isFailure).toBe(true);
    expect(response.error).toBe("AddProductVariantToCartProductVariantNotFound");
  });

  it("should add product variant to cart", async () => {
    const spy = jest.spyOn(cart.value, "addProductVariant");

    const response = await addProductVariantToCart.execute({
      cartId: "cartId",
      productVariantId: "productVariantId",
    });

    expect(response.isSuccess).toBe(true);
    expect(spy).toHaveBeenCalledWith(productVariant.value, 1);
  });
});
