import { ok } from "assert";
import * as dotenv from "dotenv";
import * as jsonfile from "jsonfile";

import { IApp, IConfig } from "./../../src/core/config.interface";

dotenv.config();

function loadApps() {
  ok(process.env.APPS);
  return process.env.APPS.split(",").map(kvStr => {
    const kvPair = kvStr.split("|");
    return { agentId: kvPair[0], agentSecret: kvPair[1] } as IApp;
  });
}

export const getSimpleConfig = (dynamic: boolean = false) => {
  const storeFile = `/tmp/${
    dynamic ? Date.now().toString() + "-" : ""
  }wechat-work-nodejs-sdk-data.json`;
  jsonfile.writeFileSync(storeFile, {}, { flag: "w" });

  const config: IConfig = {
    apps: loadApps(),
    contactSecret: process.env.CONTACT_SECRET as string,
    cropId: process.env.CROP_ID as string,
    getFromCacheMethod: async (key: string) => {
      const storeObj = jsonfile.readFileSync(storeFile);
      return Promise.resolve({ content: storeObj[key] });
    },
    saveToCacheMethod: async (
      key: string,
      content: string,
      ttlSeconds: number
    ) => {
      const storeObj = jsonfile.readFileSync(storeFile);
      storeObj[key] = content;
      jsonfile.writeFileSync(storeFile, storeObj);
    }
  };
  return config;
};

test("get simple config", () => {
  const config = getSimpleConfig();
  expect(config.apps.length).toBeGreaterThan(0);
});
