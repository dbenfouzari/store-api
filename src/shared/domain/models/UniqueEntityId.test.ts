import { validate, version } from "uuid";

import { UniqueEntityId } from "./UniqueEntityId";

describe("uniqueEntityId", () => {
  it("should create one from scratch when nothing is given", () => {
    const result = UniqueEntityId.create().toValue();

    expect(version(result)).toBe(4);
    expect(validate(result)).toBeTruthy();
  });

  it("should create one with given string", () => {
    const uuid = "ffb34ff1-5cfb-446e-9976-0330072353b9";
    const result = UniqueEntityId.create(uuid);

    expect(validate(result.toValue())).toBeTruthy();
    expect(result.toValue()).toBe(uuid);
  });

  it("should throw if given string is not correct", () => {
    const uuid = "hello world";

    expect(() => {
      UniqueEntityId.create(uuid);
    }).toThrow("It seems like given id is not a UUID. Given: `hello world`");
  });
});
