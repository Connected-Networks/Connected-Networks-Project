jest.mock("../../../backend-processing");
jest.mock("../../../sequelizeDatabase/sequelFunctions");
jest.mock("bcryptjs");
import AuthController from "../../../AuthController";

describe("emailIsValid", () => {
  it("should accept emails in the form of something@something.com", () => {
    const testEmail = "something@something.com";
    expect(AuthController.emailIsValid(testEmail)).toBe(true);
  });

  it("should accept emails in the form of some.thing@something.com", () => {
    const testEmail = "some.thing@something.com";
    expect(AuthController.emailIsValid(testEmail)).toBe(true);
  });

  it("should accept emails in the form of something@some.thing.com", () => {
    const testEmail = "something@some.thing.com";
    expect(AuthController.emailIsValid(testEmail)).toBe(true);
  });

  it("should accept emails in the form of something@something.something", () => {
    const testEmail = "something@something.something";
    expect(AuthController.emailIsValid(testEmail)).toBe(true);
  });

  it("should reject emails in the form of something@something", () => {
    const testEmail = "something@something";
    expect(AuthController.emailIsValid(testEmail)).toBe(false);
  });

  it("should reject emails in the form of @something.com", () => {
    const testEmail = "@something.com";
    expect(AuthController.emailIsValid(testEmail)).toBe(false);
  });

  it("should reject emails in the form of something.com", () => {
    const testEmail = "something.com";
    expect(AuthController.emailIsValid(testEmail)).toBe(false);
  });

  it("should reject empty emails", () => {
    const testEmail = "";
    expect(AuthController.emailIsValid(testEmail)).toBe(false);
  });
});
