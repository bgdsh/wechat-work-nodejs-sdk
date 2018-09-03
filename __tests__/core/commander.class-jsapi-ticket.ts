import { Commander } from "../../src/core";
import { getSimpleConfig } from "./../libs/simple-config";

test("get jsapi ticket", async () => {
  const config = getSimpleConfig(false);
  const commander = new Commander(config);
  const jsSdkCommander = await commander.getJsSdkCommander(
    config.apps[0].agentId
  );
  const jsApiTicket = await jsSdkCommander.getJsApiTicket();
  // tslint:disable-next-line:no-console
  expect(jsApiTicket.ticket).not.toBeUndefined();
});

test("get signature", async () => {
  const config = getSimpleConfig(false);
  const commander = new Commander(config);
  const jsSdkCommander = await commander.getJsSdkCommander(
    config.apps[0].agentId
  );
  const signatureObj = await jsSdkCommander.getSignature(
    "http://www.baidu.com"
  );
  expect(signatureObj.signature).toHaveLength(
    "0f9de62fce790f9a083d5c99e95740ceb90c27ed".length
  );
});
