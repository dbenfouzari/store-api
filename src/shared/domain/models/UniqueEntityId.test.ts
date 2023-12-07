import { validate, version } from "uuid";

import { UniqueEntityId, UniqueEntityIdExceptions } from "./UniqueEntityId";

describe("uniqueEntityId", () => {
  it("should create one from scratch when nothing is given", () => {
    const result = UniqueEntityId.create().value.toValue();

    expect(version(result)).toBe(4);
    expect(validate(result)).toBeTruthy();
  });

  it("should create one with given string", () => {
    const uuid = "ffb34ff1-5cfb-446e-9976-0330072353b9";
    const result = UniqueEntityId.create(uuid).value;

    expect(validate(result.toValue())).toBeTruthy();
    expect(result.toValue()).toBe(uuid);
  });

  it("should create one with given UniqueEntityId", () => {
    const uuidString = "ffb34ff1-5cfb-446e-9976-0330072353b9";
    const uniqueId = UniqueEntityId.create(uuidString);
    const result = UniqueEntityId.create(uniqueId.value).value;

    expect(validate(result.toValue())).toBeTruthy();
    expect(result.toValue()).toBe(uuidString);
  });

  it("should throw if given string is not correct", () => {
    const uuid = "hello world";
    const result = UniqueEntityId.create(uuid);

    expect(result.error).toBe(UniqueEntityIdExceptions.NotValidUUID);
  });
});
