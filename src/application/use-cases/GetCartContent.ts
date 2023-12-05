import type { ICartService } from "@application/services/ICartService";
import type { Cart } from "@domain/entities/Cart";
import type { Option } from "@shared/common/Option";
import type { IUseCase } from "@shared/domain/models/UseCase";

import { FetchException } from "@application/exceptions/FetchException";
import { Result } from "@shared/common/Result";

type UseCaseResponse = Result<Option<Cart>, FetchException>;

export class GetCartContent implements IUseCase<never, Promise<UseCaseResponse>> {
  constructor(private readonly cartService: ICartService) {}

  async execute(): Promise<UseCaseResponse> {
    try {
      const result = await this.cartService.getCart();

      return Result.ok(result);
    } catch (error) {
      return Result.fail(new FetchException());
    }
  }
}
