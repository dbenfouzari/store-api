import { None, Option, Some } from "./Option";

describe("Option", () => {
  describe("Constructors", () => {
    it("should create a some option when value given", () => {
      const option = Option.from("value");

      expect(option).toBeInstanceOf(Some);
    });

    it("should create a none option when undefined given", () => {
      const option = Option.from(undefined);

      expect(option).toBeInstanceOf(None);
    });

    it("should create a none option when null given", () => {
      const option = Option.from(null);

      expect(option).toBeInstanceOf(None);
    });

    it("should create a some option", () => {
      const option = Option.some("value");

      expect(option).toBeInstanceOf(Some);
    });

    it("should create a none option", () => {
      const option = Option.none();

      expect(option).toBeInstanceOf(None);
    });
  });

  describe("`isSome` method", () => {
    it("should return `true` if the option is some", () => {
      const option = Option.some("value");

      expect(option.isSome()).toBe(true);
    });

    it("should return `false` if the option is none", () => {
      const option = Option.none();

      expect(option.isSome()).toBe(false);
    });
  });

  describe("`isNone` method", () => {
    it("should return `true` if the option is none", () => {
      const option = Option.none();

      expect(option.isNone()).toBe(true);
    });

    it("should return `false` if the option is some", () => {
      const option = Option.some("value");

      expect(option.isNone()).toBe(false);
    });
  });

  describe("`expect` method", () => {
    it("should return the value if the option is some", () => {
      const option = Option.some("value");

      expect(option.expect("message")).toBe("value");
    });

    it("should throw an error if the option is none", () => {
      const option = Option.none();

      expect(() => option.expect("message")).toThrow("message");
    });
  });

  describe("`unwrap` method", () => {
    it("should return the value if the option is some", () => {
      const option = Option.some("value");

      expect(option.unwrap()).toBe("value");
    });

    it("should throw an error if the option is none", () => {
      const option = Option.none();

      expect(() => option.unwrap()).toThrow("Option is none");
    });
  });

  describe("`unwrapOr` method", () => {
    it("should return the value if the option is some", () => {
      const option = Option.some("value");

      expect(option.unwrapOr("default")).toBe("value");
    });

    it("should return the default value if the option is none", () => {
      const option = Option.none();

      expect(option.unwrapOr("default")).toBe("default");
    });
  });

  describe("`map` method", () => {
    it("should return a new some option with the mapped value if the option is some", () => {
      const option = Option.some("value");

      expect(option.map((value) => value + " mapped")).toStrictEqual(
        new Some("value mapped")
      );
    });

    it("should return a new none option if the option is none", () => {
      const option = Option.none();

      expect(option.map((value) => value + " mapped")).toStrictEqual(new None());
    });
  });

  describe("`mapOr` method", () => {
    it("should return the mapped value if the option is some", () => {
      const option = Option.some("value");

      expect(option.mapOr("default", (value) => value + " mapped")).toBe("value mapped");
    });

    it("should return the default value if the option is none", () => {
      const option = Option.none();

      expect(option.mapOr("default", (value) => value + " mapped")).toBe("default");
    });
  });

  describe("`okOr` method", () => {
    it("should return the option if the option is some", () => {
      const option = Option.some("value");
      const result = option.okOr("default");

      expect(result.value).toBe("value");
    });

    it("should return the default value if the option is none", () => {
      const option = Option.none();
      const result = option.okOr("default");

      expect(result.error).toBe("default");
    });
  });

  describe("`and` method", () => {
    it("should return the other option if the option is some", () => {
      const option = Option.some("value");
      const other = Option.some("other");

      expect(option.and(other)).toStrictEqual(other);
    });

    it("should return the none option if the option is none", () => {
      const option = Option.none();
      const other = Option.some("other");

      expect(option.and(other)).toStrictEqual(new None());
    });

    it("should return the none option if the option is some but other is none", () => {
      const option = Option.some("value");
      const other = Option.none();

      expect(option.and(other)).toStrictEqual(new None());
    });
  });

  describe("`filter` method", () => {
    it("should return the option if the option is some and the predicate is true", () => {
      const option = Option.some("value");

      expect(option.filter(() => true)).toStrictEqual(option);
    });

    it("should return the none option if the option is some and the predicate is false", () => {
      const option = Option.some("value");

      expect(option.filter(() => false)).toStrictEqual(new None());
    });

    it("should return the none option if the option is none", () => {
      const option = Option.none();

      expect(option.filter(() => true)).toStrictEqual(new None());
    });

    it("should return the none option if the predicate returns false", () => {
      const option = Option.some("value");

      expect(option.filter((value) => value === "v2")).toStrictEqual(new None());
    });
  });

  describe("`or` method", () => {
    it("should return the option if the option is some", () => {
      const option = Option.some("value");
      const other = Option.some("other");

      expect(option.or(other)).toStrictEqual(option);
    });

    it("should return the other option if the option is none", () => {
      const option = Option.none();
      const other = Option.some("other");

      expect(option.or(other)).toStrictEqual(other);
    });

    it("should return the other option if the option is some but other is none", () => {
      const option = Option.some("value");
      const other = Option.none<string>();

      expect(option.or(other)).toStrictEqual(option);
    });
  });

  describe("`zip` method", () => {
    it("should return a new some option with the zipped value if the option is some and other is some", () => {
      const option = Option.some("value");
      const other = Option.some("other");

      expect(option.zip(other)).toStrictEqual(new Some(["value", "other"]));
    });

    it("should return a new none option if the option is some but other is none", () => {
      const option = Option.some("value");
      const other = Option.none();

      expect(option.zip(other)).toStrictEqual(new None());
    });

    it("should return a new none option if the option is none", () => {
      const option = Option.none();
      const other = Option.some("other");

      expect(option.zip(other)).toStrictEqual(new None());
    });
  });

  describe("`match` method", () => {
    it("should return the value of the some function if the option is some", () => {
      const option = Option.some("value");

      expect(
        option.match(
          (value) => value + " mapped",
          () => "none"
        )
      ).toBe("value mapped");
    });

    it("should return the value of the none function if the option is none", () => {
      const option = Option.none();

      expect(
        option.match(
          (value) => value + " mapped",
          () => "none"
        )
      ).toBe("none");
    });
  });

  describe("`unzip` method", () => {
    it("should return a new some option with the unzipped value if the option is some", () => {
      const v: [string, string] = ["value", "other"];
      const option = Option.some(v);

      expect(option.unzip()).toStrictEqual([new Some("value"), new Some("other")]);
    });

    it("should return a new none option if the option is none", () => {
      const option = Option.none<[string, string]>();

      expect(option.unzip()).toStrictEqual([new None(), new None()]);
    });
  });

  describe("`flatMap` method", () => {
    it("should return the mapped value if the option is some", () => {
      const option = Option.some("value");

      expect(option.flatMap((value) => Option.some(value + " mapped"))).toStrictEqual(
        new Some("value mapped")
      );
    });

    it("should return the none option if the option is none", () => {
      const option = Option.none();

      expect(option.flatMap((value) => Option.some(value + " mapped"))).toStrictEqual(
        new None()
      );
    });

    it("should call predicate with the value if the option is some", () => {
      const option = Option.some("value");
      const predicate = jest.fn();

      option.flatMap(predicate);

      expect(predicate).toHaveBeenCalledWith("value");
    });
  });
});
