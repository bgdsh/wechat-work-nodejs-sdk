import * as dotenv from "dotenv";
import * as jsonfile from "jsonfile";

import { AccessToken, Commander } from "../../core";
import { EnumSecretType } from "../../core/secret-type.enum";
dotenv.config();
const storeFile =
  "/tmp/" + Date.now().toString() + "-wechat-work-nodejs-sdk-data.json";
jsonfile.writeFileSync(storeFile, {}, { flag: "w" });

test("access token should be same as the one in store file", async () => {
  const config = {
    apps: [],
    contactSecret: process.env.CONTACT_SECRET as string,
    cropId: process.env.CROP_ID as string,
    getAccessToken: async (key: string) => {
      const storeObj = jsonfile.readFileSync(storeFile);
      return Promise.resolve({ content: storeObj[key] });
    },
    saveAccessToken: async (
      key: string,
      content: string,
      ttlSeconds: number
    ) => {
      const storeObj = jsonfile.readFileSync(storeFile);
      storeObj[key] = content;
      jsonfile.writeFileSync(storeFile, storeObj);
    }
  };
  const commander = new Commander(config);
  expect(commander !== undefined).toBe(true);
  const contactsCommander = await commander.getContactsCommander(
    EnumSecretType.Contact
  );
  const accessTokenInCommander = contactsCommander.accessToken;
  const storeObj = jsonfile.readFileSync(storeFile);
  const key = AccessToken.key(config.cropId, EnumSecretType.Contact);
  const serialized = storeObj[key];
  const accessTokenInFile = AccessToken.deSerialize(serialized);
  expect(
    accessTokenInCommander.accessToken === accessTokenInFile.accessToken
  ).toBe(true);
  expect(
    accessTokenInCommander.expiresAt - accessTokenInFile.expiresAt
  ).toBeLessThan(3000);
});
