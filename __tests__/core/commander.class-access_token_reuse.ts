import { Commander, EnumSecretType } from "../../src/core";
import { timer } from "./../../src/core/common-helpers";
import { getSimpleConfig } from "./../libs/simple-config";

jest.setTimeout(10000);

test("access token should be reused", async () => {
  const config = getSimpleConfig(true);
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
  ).toBeLessThan(100);
});
