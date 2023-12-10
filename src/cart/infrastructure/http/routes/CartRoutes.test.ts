import type { ICartReadRepository } from "@cart/application/services/ICartReadRepository";
import type { IProductVariantReadRepository } from "@product/application/services/IProductVariantReadRepository";
import type { Application } from "express";

import express from "express";
import request from "supertest";

import {
  AddProductVariantToCart,
  AddProductVariantToCartExceptions,
} from "@cart/application/use-cases/AddProductVariantToCart";
import { Cart } from "@cart/domain/entities/Cart";
import {
  AddItemToCartExceptions,
  AddItemToCartRoute,
} from "@cart/infrastructure/http/routes/AddItemToCartRoute";
import { CartRoutes } from "@cart/infrastructure/http/routes/index";
import { InMemoryCartReadRepository } from "@cart/infrastructure/http/services/InMemoryCartReadRepository";
import { ProductVariant } from "@product/domain/entities/ProductVariant";
import { InMemoryProductVariantReadRepository } from "@product/infrastructure/services/InMemoryProductVariantReadRepository";
import { None, Some } from "@shared/common/Option";
import { UniqueEntityId } from "@shared/domain/models/UniqueEntityId";
import { DateTime } from "@shared/domain/value-objects/DateTime";

const emptyCart = Cart.create({
  createdAt: DateTime.now(),
  updatedAt: DateTime.now(),
  ownerId: UniqueEntityId.create("123e4567-e89b-12d3-a456-426614174000").unwrap(),
  items: [],
});

const productVariant = ProductVariant.create({
  name: "Test Product Variant",
  description: "",
  price: 1000,
});

describe("CartRoutes", () => {
  let app: Application;
  let cartRoutes: CartRoutes;
  let cartReadRepository: ICartReadRepository;
  let productVariantReadRepository: IProductVariantReadRepository;

  beforeEach(() => {
    cartReadRepository = new InMemoryCartReadRepository();
    productVariantReadRepository = new InMemoryProductVariantReadRepository();

    cartRoutes = new CartRoutes(
      new AddItemToCartRoute(
        new AddProductVariantToCart(cartReadRepository, productVariantReadRepository)
      )
    );
    app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cartRoutes.router);
  });

  it("should have correct _apiVersion", () => {
    expect(cartRoutes._apiVersion).toBe(1000);
  });

  describe("POST /cart/add-item", () => {
    it("should return correct response for valid request", async () => {
      jest
        .spyOn(cartReadRepository, "findCartByCartId")
        .mockResolvedValueOnce(Some.of(emptyCart.unwrap()));

      jest
        .spyOn(productVariantReadRepository, "findProductVariantByProductVariantId")
        .mockResolvedValueOnce(Some.of(productVariant.unwrap()));

      const { status, body } = await request(app).post("/cart/add-item").send({
        cartId: "123e4567-e89b-12d3-a456-426614174000",
        itemId: "123e4567-e89b-12d3-a456-426614174000",
        quantity: 1,
      });

      expect(status).toBe(201);
      expect(body).toStrictEqual({
        success: true,
      });
    });

    it("should return correct response when request body is empty", async () => {
      const { status, body } = await request(app)
        .post("/cart/add-item")
        .set("Accept", "application/json")
        .set("Content-Type", "application/json");

      expect(status).toBe(400);
      expect(body).toStrictEqual({
        success: false,
        exception: AddItemToCartExceptions.NoRequestGiven,
      });
    });

    it("should return correct response when cart is not found", async () => {
      jest
        .spyOn(cartReadRepository, "findCartByCartId")
        .mockResolvedValueOnce(new None());

      const { status, body } = await request(app).post("/cart/add-item").send({
        cartId: "123e4567-e89b-12d3-a456-426614174000",
        itemId: "123e4567-e89b-12d3-a456-426614174000",
        quantity: 1,
      });

      expect(status).toBe(400);
      expect(body).toStrictEqual({
        success: false,
        exception: AddProductVariantToCartExceptions.CartNotFound,
      });
    });

    it("should return correct response when product variant is not found", async () => {
      jest
        .spyOn(cartReadRepository, "findCartByCartId")
        .mockResolvedValueOnce(Some.of(emptyCart.unwrap()));

      jest
        .spyOn(productVariantReadRepository, "findProductVariantByProductVariantId")
        .mockResolvedValueOnce(new None());

      const { status, body } = await request(app).post("/cart/add-item").send({
        cartId: "123e4567-e89b-12d3-a456-426614174000",
        itemId: "123e4567-e89b-12d3-a456-426614174000",
        quantity: 1,
      });

      expect(status).toBe(400);
      expect(body).toStrictEqual({
        success: false,
        exception: AddProductVariantToCartExceptions.ProductVariantNotFound,
      });
    });
  });
});
