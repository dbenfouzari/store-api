# Cart use cases

## AddProductVariantToCart
> As a user, I want to add a `ProductVariant` to my cart.

User provides:
- `productVariantId`
- `quantity`

System provides:
- `userId` (from JWT)
- `currency` (from JWT)
- `locale` (from JWT)
- `cartId` from retrieved user `Cart`

Preconditions:
- `productVariantId` must exist
- `quantity` must be greater than 0
- `userId` must exist

Process:
- Get `ProductVariant` by `productVariantId`
- Create `Cart` if it doesn't exist
- If `ProductVariant` is not in `Cart`:
  - Create `CartItem` with `productVariantId`, `quantity`, `currency` and `locale`
  - Add `CartItem` to `Cart`
  - Save `Cart`
- If `ProductVariant` is in `Cart`:
  - Increase `CartItem` quantity by `quantity`
  - Save `Cart`

Output:
- None
