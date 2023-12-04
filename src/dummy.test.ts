import { square } from "./dummy";

describe("Dummy", () => {
  it("should be true", () => {
    expect(square(5)).toBe(25);
  });
});
