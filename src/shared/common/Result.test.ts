import { Result } from "@shared/common/Result";
import { ResultCannotGetErrorOfSuccess } from "@shared/domain/errors/ResultCannotGetErrorOfSuccess";
import { ResultCannotGetValueOfFailure } from "@shared/domain/errors/ResultCannotGetValueOfFailure";

describe("Result", () => {
  describe("`ok` constructor", () => {
    const resultOk = Result.ok("ok");

    it("should have `isFailure` property set to false", () => {
      expect(resultOk.isFailure).toBe(false);
    });

    it("should have `isSuccess` property set to true", () => {
      expect(resultOk.isSuccess).toBe(true);
    });

    it("should have `getValue` method returning the value", () => {
      expect(resultOk.value).toBe("ok");
    });

    it("should throw an error when calling `getError` method", () => {
      expect(() => resultOk.error).toThrow(ResultCannotGetErrorOfSuccess);
    });

    it("should have `match` method returning the value", () => {
      expect(
        resultOk.match(
          () => "error",
          (value) => value
        )
      ).toBe("ok");
    });
  });

  describe("`fail` constructor", () => {
    const resultFail = Result.fail("fail");

    it("should have `isFailure` property set to true", () => {
      expect(resultFail.isFailure).toBe(true);
    });

    it("should have `isSuccess` property set to false", () => {
      expect(resultFail.isSuccess).toBe(false);
    });

    it("should have `getError` method returning the error", () => {
      expect(resultFail.error).toBe("fail");
    });

    it("should throw an error when calling `getValue` method", () => {
      expect(() => resultFail.value).toThrow(ResultCannotGetValueOfFailure);
    });

    it("should have `match` method returning the error", () => {
      expect(
        resultFail.match(
          (error) => error,
          () => "ok"
        )
      ).toBe("fail");
    });
  });

  describe("`combine` method", () => {
    const resultOk = Result.ok("ok");
    const resultFail = Result.fail("fail");

    it("should return a success result when all results are success", () => {
      expect(Result.combine(resultOk, resultOk).isSuccess).toBe(true);
    });

    it("should return a failure result when one result is a failure", () => {
      expect(Result.combine(resultOk, resultFail).isFailure).toBe(true);
    });

    it("should return a failure result when all results are failures", () => {
      expect(Result.combine(resultFail, resultFail).isFailure).toBe(true);
    });
  });

  describe("`match` method", () => {
    const resultOk = Result.ok("ok");
    const resultFail = Result.fail("fail");

    let successCallback: jest.Mock;
    let failureCallback: jest.Mock;

    beforeEach(() => {
      successCallback = jest.fn().mockImplementation((value) => value);
      failureCallback = jest.fn().mockImplementation((error) => error);
    });

    it("should execute the `onSuccess` callback when the result is a success", () => {
      expect(resultOk.match(failureCallback, successCallback)).toBe("ok");
    });

    it("should call the `onSuccess` callback with the value", () => {
      resultOk.match(failureCallback, successCallback);

      expect(successCallback).toHaveBeenCalledWith("ok");
    });

    it("should execute the `onFailure` callback when the result is a failure", () => {
      expect(resultFail.match(failureCallback, successCallback)).toBe("fail");
    });

    it("should call the `onFailure` callback with the error", () => {
      resultFail.match(failureCallback, successCallback);

      expect(failureCallback).toHaveBeenCalledWith("fail");
    });
  });

  describe("`matchObj` method", () => {
    const resultOk = Result.ok("ok");
    const resultFail = Result.fail("fail");

    let successCallback: jest.Mock;
    let failureCallback: jest.Mock;

    beforeEach(() => {
      successCallback = jest.fn().mockImplementation((value) => value);
      failureCallback = jest.fn().mockImplementation((error) => error);
    });

    it("should execute the `onSuccess` callback when the result is a success", () => {
      expect(resultOk.matchObj({ fail: failureCallback, ok: successCallback })).toBe(
        "ok"
      );
    });

    it("should call the `onSuccess` callback with the value", () => {
      resultOk.matchObj({ fail: failureCallback, ok: successCallback });

      expect(successCallback).toHaveBeenCalledWith("ok");
    });

    it("should execute the `onFailure` callback when the result is a failure", () => {
      expect(resultFail.matchObj({ fail: failureCallback, ok: successCallback })).toBe(
        "fail"
      );
    });

    it("should call the `onFailure` callback with the error", () => {
      resultFail.matchObj({ fail: failureCallback, ok: successCallback });

      expect(failureCallback).toHaveBeenCalledWith("fail");
    });
  });
});
