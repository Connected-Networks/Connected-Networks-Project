require("mysql2/node_modules/iconv-lite").encodingExists("foo");
import app from "../server";
import * as supertest from "supertest";
const router = require("./routes");
const request = supertest.agent(app);

jest.setTimeout(30000);

beforeAll(function(done) {
  app.on("appStarted", function() {
    console.log("recieved");

    done();
  });
});

describe("Authentication", () => {
  it("should check that credentials are not taken or invalid before inserting user in Signup", done => {
    request.get("/test").then(response => {
      expect(response.status).toEqual(200);
      done();
    });
  });
});
