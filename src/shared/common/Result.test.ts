import { Result } from "@shared/common/Result";

describe("result", () => {
  describe("with success value", () => {
    const result = Result.ok("Hello");

    it("should have a `isSuccess` property set to true", () => {
      expect(result.isSuccess).toBe(true);
    });

    it("should have a `isFailure` property set to false", () => {
      expect(result.isFailure).toBe(false);
    });

    it("should return value", () => {
      expect(result.getValue()).toBe("Hello");
    });

    it("should return an empty error", () => {
      expect(result.getErrorValue()).toBe("");
    });
  });

  describe("with error value", () => {
    const result = Result.fail("Oh no!");

    it("should have a `isSuccess` property set to false", () => {
      expect(result.isSuccess).toBe(false);
    });

    it("should have a `isFailure` property set to true", () => {
      expect(result.isFailure).toBe(true);
    });

    it("should throw an error if we try to get its value", () => {
      expect(() => {
        result.getValue();
      }).toThrow("Can't get the value of an error result. Use `getErrorValue` instead.");
    });

    it("should return an error", () => {
      expect(result.getErrorValue()).toBe("Oh no!");
    });
  });

  describe("with child inheritance that allows a public constructor", () => {
    class ChildResult<T> extends Result<T> {
      public constructor(isSuccess: boolean, error?: string, value?: T) {
        super(isSuccess, error, value);
      }
    }

    it("should protect against defining isSuccess and an error message in the same time", () => {
      expect(() => {
        new ChildResult(true, "Error", "Value");
      }).toThrow("InvalidOperation: A result cannot be successful and contain an error.");
    });

    it("should protect against defining isFailure without an error", () => {
      expect(() => {
        new ChildResult(false, undefined, "Value");
      }).toThrow("InvalidOperation: A failing result needs to contain an error message.");
    });
  });
});
