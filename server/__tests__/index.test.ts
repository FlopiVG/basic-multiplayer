import "jest";

import { App } from "../index";

describe("Server test suite", () => {
  test("The app starts without errors", () => {
    new App();
  });
});
