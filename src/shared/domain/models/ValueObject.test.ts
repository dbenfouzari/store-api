import { ValueObject } from "./ValueObject";

interface ChildValueObjectProps {
  hello: string;
}

class ChildValueObject extends ValueObject<ChildValueObjectProps> {
  constructor(props: ChildValueObjectProps) {
    super(props);
  }
}

class ChildValueObjectWithoutProps extends ValueObject<undefined> {
  constructor() {
    super(undefined);
  }
}

describe("valueObject", () => {
  it("should create a new value object", () => {
    const childValueObject = new ChildValueObject({ hello: "world" });

    expect(childValueObject).toBeInstanceOf(ValueObject);
  });

  it("should create an undefined value object", () => {
    const childValueObject = new ChildValueObjectWithoutProps();

    expect(childValueObject.props).toBeUndefined();
  });

  describe("equality comparison", () => {
    const helloWorld = new ChildValueObject({ hello: "world" });
    const helloWorldBis = new ChildValueObject({ hello: "world" });
    const helloJest = new ChildValueObject({ hello: "jest" });
    const undefinedProps = new ChildValueObjectWithoutProps();

    it("should return true when compared to really same object", () => {
      expect(helloWorld.equals(helloWorld)).toBe(true);
    });

    it("should return true when compared to another object with same props", () => {
      expect(helloWorld.equals(helloWorldBis)).toBe(true);
    });

    it("should return false when compared to another object with different props", () => {
      expect(helloWorld.equals(helloJest)).toBe(false);
    });

    it("should return false when compared to null", () => {
      expect(helloWorld.equals(null)).toBe(false);
    });

    it("should return false when compared to undefined", () => {
      expect(helloWorld.equals(undefined)).toBe(false);
    });

    it("should return false when compared to another value object", () => {
      // @ts-expect-error We want to test all cases
      expect(helloWorld.equals(undefinedProps)).toBe(false);
    });
  });
});
