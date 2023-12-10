import { validate } from "uuid";

import { Entity } from "./Entity";
import { UniqueEntityId } from "./UniqueEntityId";

type ChildEntityProps = {
  hello: string;
};

class ChildEntity extends Entity<ChildEntityProps> {
  constructor(props: ChildEntityProps, id?: UniqueEntityId) {
    super(props, id);
  }

  get id() {
    return this._id;
  }
}

describe("entity", () => {
  it("should create an entity with its own ID when not given", () => {
    const result = new ChildEntity({ hello: "world" });
    expect(result.id.toValue()).toBeTruthy();
    expect(typeof result.id.toValue()).toBe("string");
    expect(validate(result.id.toValue())).toBe(true);
  });

  it("should create an entity with its own ID when given", () => {
    const id = UniqueEntityId.create("cc464680-f3ba-4748-b92c-dc962824d949").unwrap();
    const result = new ChildEntity({ hello: "world" }, id);

    expect(result.id.toValue()).toBeTruthy();
    expect(result.id.equals(id)).toBeTruthy();
    expect(validate(result.id.toValue())).toBeTruthy();
  });

  describe("equality comparison", () => {
    const id = UniqueEntityId.create("cc464680-f3ba-4748-b92c-dc962824d949").unwrap();

    const entity1 = new ChildEntity({ hello: "world" }, id);
    const entity2 = new ChildEntity({ hello: "world" });
    const entity3 = new ChildEntity({ hello: "jest" }, id);

    it("should return true when comparing to exact same object", () => {
      expect(entity1.equals(entity1)).toBe(true);
    });

    it("should return true when comparing to another object with same id", () => {
      expect(entity1.equals(entity3)).toBe(true);
    });

    it("should return false when comparing to another object with same props but another id", () => {
      expect(entity1.equals(entity2)).toBe(false);
    });

    it("should return false when comparing to null", () => {
      expect(entity1.equals(null)).toBe(false);
    });

    it("should return false when comparing to undefined", () => {
      expect(entity1.equals(undefined)).toBe(false);
    });

    it("should return false when comparing to a number", () => {
      // @ts-expect-error This cannot happen in a TypeScript world, but in runtime.
      expect(entity1.equals(1)).toBe(false);
    });
  });

  it("should have correct implementation of `toString`", () => {
    const result = new ChildEntity({ hello: "world" });

    expect(result.toString()).toBe('ChildEntity (hello: "world")');
  });

  it("should have correct implementation of `toString` when props are undefined", () => {
    class Example extends Entity<undefined> {
      constructor() {
        super(undefined);
      }
    }

    const result = new Example();

    expect(result.toString()).toBe("Example");
  });

  it("should have correct implementation of `toString` when props is array", () => {
    class Example extends Entity<[number]> {
      constructor() {
        super([2]);
      }
    }

    const result = new Example();

    expect(result.toString()).toBe("Example");
  });

  it("should have correct implementation of `toString` when props is string", () => {
    class Example extends Entity<string> {
      constructor() {
        super("john");
      }
    }

    const result = new Example();

    expect(result.toString()).toBe("Example");
  });

  it("should have correct implementation of `toString` when props is number", () => {
    class Example extends Entity<number> {
      constructor() {
        super(42);
      }
    }

    const result = new Example();

    expect(result.toString()).toBe("Example");
  });

  it("should have correct implementation of `toString` when props is date", () => {
    class Example extends Entity<Date> {
      constructor() {
        super(new Date());
      }
    }

    const result = new Example();

    expect(result.toString()).toBe("Example");
  });
});
