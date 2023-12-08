import type { CreateUserProps } from "@auth/domain/entities/User";

import { User } from "@auth/domain/entities/User";
import { EmailExceptions } from "@auth/domain/value-objects/Email";
import { FirstNameExceptions } from "@auth/domain/value-objects/FirstName";
import { LastNameExceptions } from "@auth/domain/value-objects/LastName";
import { PasswordExceptions } from "@auth/domain/value-objects/Password";

describe("User", () => {
  const validProps: CreateUserProps = {
    firstName: "John",
    lastName: "Doe",
    email: "john@doe.com",
    password: "myComplexPassword123!",
  };

  it("should return a user when valid props are provided", () => {
    const userResult = User.create(validProps);

    expect(userResult.isSuccess).toBe(true);
  });

  it("should fail when firstName is too short", () => {
    const userResult = User.create({
      ...validProps,
      firstName: "J",
    });

    expect(userResult.error).toBe(FirstNameExceptions.TooShort);
  });

  it("should fail when lastName is too short", () => {
    const userResult = User.create({
      ...validProps,
      lastName: "D",
    });

    expect(userResult.error).toBe(LastNameExceptions.TooShort);
  });

  it("should fail when email is invalid", () => {
    const userResult = User.create({
      ...validProps,
      email: "invalidEmail",
    });

    expect(userResult.error).toBe(EmailExceptions.IncorrectFormat);
  });

  describe("password", () => {
    it("should fail when password is too short", () => {
      const userResult = User.create({
        ...validProps,
        password: "123",
      });

      expect(userResult.error).toBe(PasswordExceptions.TooShort);
    });

    it("should fail when password doesn't have a number", () => {
      const userResult = User.create({
        ...validProps,
        password: "myComplexPassword!",
      });

      expect(userResult.error).toBe(PasswordExceptions.MustHaveAtLeastOneNumber);
    });

    it("should fail when password doesn't have an uppercase letter", () => {
      const userResult = User.create({
        ...validProps,
        password: "mycomplexpassword123!",
      });

      expect(userResult.error).toBe(PasswordExceptions.MustHaveAtLeastOneUpperCaseLetter);
    });

    it("should fail when password doesn't have a lowercase letter", () => {
      const userResult = User.create({
        ...validProps,
        password: "MYCOMPLEXPASSWORD123!",
      });

      expect(userResult.error).toBe(PasswordExceptions.MustHaveAtLeastOneLowerCaseLetter);
    });

    it("should fail when password doesn't have a special character", () => {
      const userResult = User.create({
        ...validProps,
        password: "MyComplexPassword123",
      });

      expect(userResult.error).toBe(
        PasswordExceptions.MustHaveAtLeastOneSpecialCharacter
      );
    });
  });
});
