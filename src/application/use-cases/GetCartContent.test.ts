import type { ICartService } from "@application/services/ICartService";

import { FetchException } from "@application/exceptions/FetchException";
import { GetCartContent } from "@application/use-cases/GetCartContent";
import { Cart } from "@domain/entities/Cart";
import { CartItem } from "@domain/entities/CartItem";
import { Option } from "@shared/common/Option";

describe("GetCartContent", () => {
  let service: ICartService;

  beforeEach(() => {
    service = {
      getCart: jest.fn(),
      addItemToCart: jest.fn(),
      removeItemFromCart: jest.fn(),
      clearCart: jest.fn(),
      updateItemInCart: jest.fn(),
    };
  });

  describe("with getCart throwing an error", () => {
    let useCase: GetCartContent;

    beforeEach(() => {
      jest.spyOn(service, "getCart").mockRejectedValueOnce(new Error("error"));
      useCase = new GetCartContent(service);
    });

    it("should be a failure result", async () => {
      const value = await useCase.execute();

      expect(value.isFailure).toBe(true);
    });

    it("should be a failure result with CartNotFoundException", async () => {
      const value = await useCase.execute();

      expect(value.error).toBeInstanceOf(FetchException);
    });

    it("should match to error callback", async () => {
      const value = await useCase.execute();
      const errorCallback = jest.fn();

      value.match(errorCallback, () => {});

      expect(errorCallback).toHaveBeenCalledWith(new FetchException());
    });
  });

  describe("with getCart returning null", () => {
    let useCase: GetCartContent;

    beforeEach(() => {
      jest.spyOn(service, "getCart").mockResolvedValueOnce(Option.none<Cart>());
      useCase = new GetCartContent(service);
    });

    it("should be a success result", async () => {
      const value = await useCase.execute();

      expect(value.isSuccess).toBe(true);
    });

    it("should be a success result with None", async () => {
      const value = await useCase.execute();
      const option = value.value;

      expect(option.isNone()).toBe(true);
    });

    it("should match to success callback", async () => {
      const value = await useCase.execute();
      const successCallback = jest.fn();

      value.match(jest.fn(), successCallback);

      expect(successCallback).toHaveBeenCalledWith(Option.none());
    });
  });

  describe("with getCart returning a cart", () => {
    const cart = Cart.create();
    let useCase: GetCartContent;

    beforeEach(() => {
      jest.spyOn(service, "getCart").mockResolvedValueOnce(Option.some(cart));
      useCase = new GetCartContent(service);
    });

    it("should be a success result", async () => {
      const useCaseResponse = await useCase.execute();

      expect(useCaseResponse.isSuccess).toBe(true);
    });

    it("should be a success result with cart", async () => {
      const value = await useCase.execute();

      expect(value.value.unwrap()).toBe(cart);
    });

    it("should match to success callback", async () => {
      const value = await useCase.execute();
      const successCallback = jest.fn();

      value.matchObj({ ok: successCallback });

      expect(successCallback).toHaveBeenCalledWith(Option.some(cart));
    });
  });

  describe("with getCart returning a cart with items", () => {
    const cart = Cart.create({
      items: [
        CartItem.create({
          productId: "1",
          quantity: 1,
        }),
      ],
    });

    it("should contain the cart items", async () => {
      jest.spyOn(service, "getCart").mockResolvedValueOnce(Option.some(cart));
      const useCase = new GetCartContent(service);
      const value = await useCase.execute();

      expect(value.value.unwrap().props.items).toStrictEqual(cart.props.items);
    });
  });
});
