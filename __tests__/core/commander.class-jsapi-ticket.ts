import { Commander } from "../../src/core";
import { getSimpleConfig } from "./../libs/simple-config";

test("get jsapi ticket", async () => {
  const config = getSimpleConfig();
  const commander = new Commander(config);
  const jsSdkCommander = await commander.getJsSdkCommander(
    config.apps[0].agentId
  );
  const jsApiTicket = await jsSdkCommander.getJsApiTicket();
  // tslint:disable-next-line:no-console
  console.log("%j", jsApiTicket);
  expect(jsApiTicket.ticket).not.toBeUndefined();
});
