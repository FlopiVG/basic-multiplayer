import "jest";
import { Application } from "express";
import supertest = require("supertest");

import { App } from "../App";

let app: Application;
let request: supertest.SuperTest<supertest.Test>;


describe("Server test suite", () => {

  beforeAll(() => {
    app = new App().app;
  });

  test("The app starts without errors", async () => {
    request = supertest(app);
    const response = await request.get("/");
    expect(response.status).toBe(200);
    expect(response.type).toBe("text/html");
  });

  afterAll((done) => {
    app.close(done);
  });
});
