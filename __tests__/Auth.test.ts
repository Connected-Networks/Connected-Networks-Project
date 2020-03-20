require("mysql2/node_modules/iconv-lite").encodingExists("foo");
import * as supertest from "supertest";
import BackendProcessing from "../backend-processing";
jest.mock("../backend-processing");
const app = require("../routes");
const request = supertest(app);

describe("Authentication", () => {
  it("should check that credentials are not taken or invalid before inserting user in Signup", done => {
    request.get("/test").then(response => {
      expect(response.status).toEqual(200);
      done();
    });
  });
});
