import * as dotenv from "dotenv";
import * as jsonfile from "jsonfile";

import { AccessToken, Commander } from "../../core";
import { timer } from "../../core/common-helpers";
import { EnumSecretType } from "../../core/secret-type.enum";

dotenv.config();
const storeFile = "/tmp/wechat-work-nodejs-sdk-data.json";
jsonfile.writeFileSync(storeFile, {}, { flag: "w" });

jest.setTimeout(10000);

test("access token should be reused", async () => {
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
  const commander1 = new Commander(config);
  const contactsCommander1 = await commander1.getContactsCommander(
    EnumSecretType.Contact
  );

  await timer(5000);

  const commander2 = new Commander(config);
  const contactsCommander2 = await commander2.getContactsCommander(
    EnumSecretType.Contact
  );

  expect(contactsCommander1.accessToken).toMatchObject({
    accessToken: contactsCommander2.accessToken.accessToken,
    config: contactsCommander2.accessToken.config,
    // expiresAt: contactsCommander2.accessToken.expiresAt,
    secretType: contactsCommander2.accessToken.secretType
  });

  expect(
    Math.abs(
      contactsCommander1.accessToken.expiresAt -
        contactsCommander2.accessToken.expiresAt
    )
  ).toBeLessThan(1);
});
