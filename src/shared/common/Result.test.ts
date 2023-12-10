import type { Result } from "./Result";

import { Ok, Err } from "./Result";

describe("Result", () => {
  describe("and", () => {
    it("should return error since first value is Ok", () => {
      const x: Result<number, string> = Ok.of(2);
      const y: Result<number, string> = Err.of("late error");
      expect(x.and(y)).toStrictEqual(Err.of("late error"));
    });

    it("should return error since first value is Err", () => {
      const x: Result<number, string> = Err.of("early error");
      const y: Result<number, string> = Ok.of(2);
      expect(x.and(y)).toStrictEqual(Err.of("early error"));
    });

    it("should return Ok since both values are Ok", () => {
      const x: Result<number, string> = Ok.of(2);
      const y: Result<number, string> = Ok.of(100);
      expect(x.and(y)).toStrictEqual(Ok.of(100));
    });
  });

  describe("andThen", () => {
    it("should return error since first value is Ok", () => {
      const sq = (x: number): Result<number, number> => Ok.of(x * x);
      const err = (x: number): Result<number, number> => Err.of(x);

      expect(Ok.of(2).andThen(sq).andThen(sq)).toStrictEqual(Ok.of(16));
      expect(Ok.of(2).andThen(sq).andThen(err)).toStrictEqual(Err.of(4));
      expect(Ok.of(2).andThen(err).andThen(sq)).toStrictEqual(Err.of(2));
      expect(Err.of<number, number>(3).andThen(sq).andThen(sq)).toStrictEqual(Err.of(3));
    });
  });
});
