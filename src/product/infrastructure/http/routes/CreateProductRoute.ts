import type { Request } from "express";

import { Router } from "express";
import { inject, injectable } from "tsyringe";

import { ensureUserIsAdmin } from "@auth/infrastructure/http/middlewares";
import { CreateProductUseCase } from "@product/application/use-cases/CreateProductUseCase";
import { ProductUseCasesTokens } from "@product/di/tokens";

/**
 * @openapi
 * components:
 *   requestBodies:
 *     CreateProductBody:
 *       description: The product to create.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 description: The product name.
 *                 example: "Product 1"
 *                 nullable: false
 *                 minLength: 3
 *                 maxLength: 20
 *               description:
 *                 type: string
 *                 description: The product description.
 *                 example: "Product 1 description"
 *                 nullable: false
 */
type CreateProductBody = {
  name: string;
  description: string;
};

/**
 * @openapi
 * components:
 *   responses:
 *     CreateProductSuccessResponse:
 *       description: The product response.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - success
 *             properties:
 *               success:
 *                 type: boolean
 *                 description: Whether the request was successful.
 *                 example: true
 *                 nullable: false
 *                 enum: [true]
 */
type CreateProductSuccessResponse = {
  success: true;
};

/**
 * @openapi
 * components:
 *   responses:
 *     CreateProductErrorResponse:
 *       description: The error response.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - success
 *               - exception
 *             properties:
 *               success:
 *                 type: boolean
 *                 description: Whether the request was successful.
 *                 example: false
 *                 nullable: false
 *                 enum: [false]
 *               exception:
 *                 type: string
 *                 description: The exception message.
 *                 example: "Product name must be between 3 and 20 characters."
 *                 nullable: false
 *                 enum: ["Product name must be between 3 and 20 characters."]
 */
type CreateProductErrorResponse = {
  success: false;
  exception: string;
};

type CreateProductResponse = CreateProductSuccessResponse | CreateProductErrorResponse;

/**
 * @openapi
 * /products:
 *   post:
 *     tags: [Product]
 *     security:
 *       - BearerAuth: []
 *     summary: Create a product.
 *     description: |
 *       Create a product.
 *       Only an admin can create a product.
 *       The product name must be between 3 and 20 characters.
 *     requestBody:
 *       $ref: "#/components/requestBodies/CreateProductBody"
 *     responses:
 *       201:
 *         $ref: "#/components/responses/CreateProductSuccessResponse"
 *       401:
 *         $ref: "#/components/responses/Unauthorized"
 *       400:
 *         $ref: "#/components/responses/CreateProductErrorResponse"
 */
@injectable()
export class CreateProductRoute {
  private router = Router();

  constructor(
    @inject(ProductUseCasesTokens.CreateProductUseCase)
    private createProductUseCase: CreateProductUseCase
  ) {}

  register() {
    this.router.post(
      "/products",
      ensureUserIsAdmin,
      async (
        request: Request<{}, CreateProductResponse, CreateProductBody>,
        response
      ) => {
        const { name, description } = request.body;

        const result = await this.createProductUseCase.execute({
          name,
          description,
        });

        return result.match(
          (value) => response.status(201).json({ success: true }),
          (error) => response.status(400).json({ success: false, exception: error })
        );
      }
    );

    return this.router;
  }
}
