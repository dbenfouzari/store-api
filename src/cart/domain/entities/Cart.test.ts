import type { CreateCartProps } from "./Cart";

import { DateTime } from "@shared/domain/value-objects/DateTime";

import { Cart } from "./Cart";

describe("Cart", () => {
  it("should create a cart with minimal valid props", () => {
    const props: CreateCartProps = {
      ownerId: "425fab45-27a2-451a-a506-9b2918658fe1",
    };

    const cartResult = Cart.create(props);

    expect(cartResult.isSuccess).toBe(true);
  });

  describe("with all valid props", () => {
    const props: CreateCartProps = {
      createdAt: "2021-01-01T00:00:00.000Z",
      updatedAt: "2023-11-21T00:00:00.000Z",
      ownerId: "425fab45-27a2-451a-a506-9b2918658fe1",
      items: [
        {
          productVariant: {
            name: "T-Shirt",
            price: 1000,
            description: "A nice T-Shirt",
          },
        },
      ],
    };

    const cartResult = Cart.create(props);

    it("should create a cart", () => {
      expect(cartResult.isSuccess).toBe(true);
    });

    it("should have a creation date", () => {
      const cart = cartResult.value;
      expect(cart.props.createdAt.props.value.toIso8601String()).toBe(
        new DateTime({
          year: 2021,
          month: 1,
          day: 1,
        }).toIso8601String()
      );
    });

    it("should have an update date", () => {
      const cart = cartResult.value;
      expect(cart.props.updatedAt.props.value.toIso8601String()).toBe(
        new DateTime({
          year: 2023,
          month: 11,
          day: 21,
        }).toIso8601String()
      );
    });

    it("should have an owner id", () => {
      const cart = cartResult.value;
      expect(cart.props.ownerId.toString()).toBe("425fab45-27a2-451a-a506-9b2918658fe1");
    });

    it("should have items", () => {
      const cart = cartResult.value;
      expect(cart.props.items.size).toBe(1);
    });
  });

  it("should create a cart with a creation date as a `DateTime`", () => {
    const props: CreateCartProps = {
      createdAt: new DateTime({
        year: 2021,
        month: 1,
        day: 1,
      }),
      ownerId: "425fab45-27a2-451a-a506-9b2918658fe1",
    };

    const cartResult = Cart.create(props);

    expect(cartResult.isSuccess).toBe(true);
  });

  it("should create a cart with an update date as a `DateTime`", () => {
    const props: CreateCartProps = {
      updatedAt: new DateTime({
        year: 2021,
        month: 1,
        day: 1,
      }),
      ownerId: "425fab45-27a2-451a-a506-9b2918658fe1",
    };

    const cartResult = Cart.create(props);

    expect(cartResult.isSuccess).toBe(true);
  });

  describe("with invalid props", () => {
    it("should fail if the owner id is not a valid uuid", () => {
      const props: CreateCartProps = {
        ownerId: "invalid-uuid",
      };

      const cartResult = Cart.create(props);

      expect(cartResult.isFailure).toBe(true);
    });

    it("should fail if the creation date is not a valid date", () => {
      const props: CreateCartProps = {
        createdAt: "invalid-date",
        ownerId: "425fab45-27a2-451a-a506-9b2918658fe1",
      };

      const cartResult = Cart.create(props);

      expect(cartResult.isFailure).toBe(true);
    });

    it("should fail if the creation date is in the future", () => {
      const props: CreateCartProps = {
        createdAt: "2123-11-21T00:00:00.000Z",
        ownerId: "425fab45-27a2-451a-a506-9b2918658fe1",
      };

      const cartResult = Cart.create(props);

      expect(cartResult.isFailure).toBe(true);
    });

    it("should fail if the update date is not a valid date", () => {
      const props: CreateCartProps = {
        updatedAt: "invalid-date",
        ownerId: "425fab45-27a2-451a-a506-9b2918658fe1",
      };

      const cartResult = Cart.create(props);

      expect(cartResult.isFailure).toBe(true);
    });

    it("should fail if the update date is in the future", () => {
      const props: CreateCartProps = {
        updatedAt: "2123-11-21T00:00:00.000Z",
        ownerId: "425fab45-27a2-451a-a506-9b2918658fe1",
      };

      const cartResult = Cart.create(props);

      expect(cartResult.isFailure).toBe(true);
    });

    it("should fail if one of the items is invalid", () => {
      const props: CreateCartProps = {
        ownerId: "425fab45-27a2-451a-a506-9b2918658fe1",
        items: [
          {
            productVariant: {
              name: "T-Shirt",
              price: 1000,
              description: "A nice T-Shirt",
            },
          },
          {
            productVariant: {
              name: "T-Shirt",
              price: 1000,
              description: "A nice T-Shirt",
            },
            quantity: 0,
          },
        ],
      };

      const cartResult = Cart.create(props);

      expect(cartResult.isFailure).toBe(true);
    });
  });
});
