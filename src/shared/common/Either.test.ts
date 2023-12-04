import { left, right } from "@shared/common/Either";

describe("either", () => {
  it("should return a left instance", () => {
    const result = left(new Error());

    expect(result.getIsLeft()).toBeTruthy();
    expect(result.getIsRight()).toBeFalsy();
    expect(result.value).toBeInstanceOf(Error);
  });

  it("should return a right instance", () => {
    const result = right({ hello: "world" });

    expect(result.getIsLeft()).toBeFalsy();
    expect(result.getIsRight()).toBeTruthy();
    expect(result.value).toStrictEqual({ hello: "world" });
  });
});
