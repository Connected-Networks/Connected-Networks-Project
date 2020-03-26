jest.mock("../../../backend-processing");
jest.mock("../../../sequelizeDatabase/sequelFunctions");
jest.mock("bcryptjs");
import AuthController from "../../../AuthController";

describe("emailIsValid", () => {
  it("should accept emails in the form of something@something.com", () => {
    const testEmail = "something@something.com";
    expect(AuthController.emailIsValid(testEmail)).toBe(true);
  });

  it("should rejects emails in the form of something@something", () => {
    const testEmail = "something@something";
    expect(AuthController.emailIsValid(testEmail)).toBe(false);
  });
});
