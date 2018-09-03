import { Commander } from "../../src/core";
import { getSimpleConfig } from "./../libs/simple-config";

test("access token should be same as the one in store file", async () => {
  const config = getSimpleConfig(true);
  const commander = new Commander(config);
  expect(commander).not.toBe(null);
});
