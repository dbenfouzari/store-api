import type { ProductVariantExceptions } from "./ProductVariant";
import type { ProductTitleExceptions } from "../value-objects/ProductTitle";
import type { PriceExceptions } from "@product/domain/value-objects/Price";
import type { Result } from "@shared/common/Result";
import type { UniqueEntityId } from "@shared/domain/models/UniqueEntityId";

import { Err, Ok } from "@shared/common/Result";
import { Entity } from "@shared/domain/models/Entity";

import { ProductTitle } from "../value-objects/ProductTitle";

import { ProductVariant } from "./ProductVariant";

type ProductProps = {
  name: ProductTitle;
  variants: Set<ProductVariant>;
};

type CreateProductProps = {
  name: string;
  description?: string;
  variants?: {
    name: string;
    description?: string;
    price: number;
  }[];
};

type ProductFailure = ProductTitleExceptions | ProductVariantExceptions | PriceExceptions;

export class Product extends Entity<ProductProps> {
  private constructor(props: ProductProps, id?: UniqueEntityId) {
    super(props, id);
  }

  static create(
    props: CreateProductProps,
    id?: UniqueEntityId
  ): Result<Product, ProductFailure> {
    /**
     * Get the results of the variants.
     * If the variants are not provided, create a default variant.
     * @returns The results of the variants.
     */
    function getVariantsResults() {
      if (props.variants) {
        return props.variants.map((variant) =>
          ProductVariant.create({
            name: variant.name,
            description: variant.description,
            price: variant.price,
          })
        );
      }

      const defaultVariantResult = ProductVariant.create({
        name: props.name ?? "Default",
        description: props.description,
        price: 0,
      });

      return [defaultVariantResult];
    }

    const titleResult = ProductTitle.create(props.name);

    const variantsResults = getVariantsResults();

    const areAllVariantsValid = variantsResults.every((result) => result.isOk());

    if (!areAllVariantsValid) {
      return Err.of(variantsResults.find((result) => result.isErr())!.unwrapErr());
    }

    return Ok.of(
      new Product(
        {
          name: titleResult.unwrap(),
          variants: new Set(variantsResults.map((result) => result.unwrap())),
        },
        id
      )
    );
  }
}
