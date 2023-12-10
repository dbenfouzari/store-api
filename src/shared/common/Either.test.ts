import { Left, Right } from "@shared/common/Either";
import { None, Option, Some } from "@shared/common/Option";

describe("Either", () => {
  describe("Left", () => {
    it("should create a Left", () => {
      const left = Left.from("left");
      expect(left.isLeft()).toBe(true);
      expect(left.value).toBe("left");
    });

    it("should not be right", () => {
      const left = Left.from("left");
      expect(left.isRight()).toBe(false);
    });
  });

  describe("Right", () => {
    it("should create a Right", () => {
      const right = Right.from("right");
      expect(right.isRight()).toBe(true);
      expect(right.value).toBe("right");
    });

    it("should not be left", () => {
      const right = Right.from("right");
      expect(right.isLeft()).toBe(false);
    });
  });

  describe("left", () => {
    it("should convert the left side of Either<L, R> to an Some<L>", () => {
      const left = Left.from("left");
      expect(left.left()).toStrictEqual(Some.of("left"));
    });

    it("should convert the right side of Either<L, R> to a None", () => {
      const right = Right.from("right");
      expect(right.left()).toStrictEqual(new None());
    });
  });

  describe("right", () => {
    it("should convert the right side of Either<L, R> to an Some<R>", () => {
      const right = Right.from("right");
      expect(right.right()).toStrictEqual(Some.of("right"));
    });

    it("should convert the left side of Either<L, R> to a None", () => {
      const left = Left.from("left");
      expect(left.right()).toStrictEqual(new None());
    });
  });

  describe("flip", () => {
    it("should convert Either<L, R> to Either<R, L>", () => {
      const left = Left.from("left");
      expect(left.flip()).toStrictEqual(Right.from("left"));

      const right = Right.from("right");
      expect(right.flip()).toStrictEqual(Left.from("right"));
    });
  });

  describe("mapLeft", () => {
    it("should map the left side of Either<L, R> to Either<L2, R>", () => {
      const left = Left.from("left");
      expect(left.mapLeft((value) => value + "2")).toStrictEqual(Left.from("left2"));

      const right = Right.from("right");
      expect(right.mapLeft((value) => value + "2")).toStrictEqual(Right.from("right"));
    });
  });

  describe("mapRight", () => {
    it("should map the right side of Either<L, R> to Either<L, R2>", () => {
      const left = Left.from("left");
      expect(left.mapRight((value) => value + "2")).toStrictEqual(Left.from("left"));

      const right = Right.from("right");
      expect(right.mapRight((value) => value + "2")).toStrictEqual(Right.from("right2"));
    });
  });

  describe("mapEither", () => {
    it("should map the left side of Either<L, R> to Either<L2, R2>", () => {
      const left = Left.from("left");
      expect(
        left.mapEither(
          (value) => value + "2",
          (value) => value + "2"
        )
      ).toStrictEqual(Left.from("left2"));

      const right = Right.from("right");
      expect(
        right.mapEither(
          (value) => value + "2",
          (value) => value + "2"
        )
      ).toStrictEqual(Right.from("right2"));
    });
  });

  describe("match", () => {
    it("should match the left side of Either<L, R> to a Left", () => {
      const left = Left.from("left");
      expect(
        left.match(
          (value) => value + "l2",
          (value) => value + "r2"
        )
      ).toBe("leftl2");
    });

    it("should match the right side of Either<L, R> to a Right", () => {
      const right = Right.from("right");
      expect(
        right.match(
          (value) => value + "l2",
          (value) => value + "r2"
        )
      ).toBe("rightr2");
    });
  });

  describe("either", () => {
    it("should match the left side of Either<L, R> to a Left", () => {
      const left = Left.from("left");
      expect(
        left.either(
          (value) => value + "l2",
          (value) => value + "r2"
        )
      ).toBe("leftl2");
    });

    it("should match the right side of Either<L, R> to a Right", () => {
      const right = Right.from("right");
      expect(
        right.either(
          (value) => value + "l2",
          (value) => value + "r2"
        )
      ).toBe("rightr2");
    });
  });

  describe("map", () => {
    it("should map the right side of Either<L, R> to Either<L, R2>", () => {
      const left = Left.from("left");
      expect(left.map((value) => value + "2")).toStrictEqual(Left.from("left2"));

      const right = Right.from("right");
      expect(right.map((value) => value + "2")).toStrictEqual(Right.from("right2"));
    });
  });

  describe("unwrapLeft", () => {
    it("should unwrap the left side of Either<L, R> to an L", () => {
      const left = Left.from("left");
      expect(left.unwrapLeft()).toBe("left");
    });

    it("should throw an error when unwrapping the left side of Either<L, R> to an L", () => {
      const right = Right.from("right");
      expect(() => right.unwrapLeft()).toThrow(
        "Called `Either.unwrapLeft()` on a `Right` value"
      );
    });
  });

  describe("unwrapRight", () => {
    it("should unwrap the right side of Either<L, R> to an R", () => {
      const right = Right.from("right");
      expect(right.unwrapRight()).toBe("right");
    });

    it("should throw an error when unwrapping the right side of Either<L, R> to an R", () => {
      const left = Left.from("left");
      expect(() => left.unwrapRight()).toThrow(
        "Called `Either.unwrapRight()` on a `Left` value"
      );
    });
  });
});
