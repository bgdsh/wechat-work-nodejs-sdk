import { ContactsCommander } from "../contacts";
import { AccessToken } from "./access-token.class";
import { IConfig } from "./config.interface";
import { EnumSecretType } from "./secret-type.enum";

export class Commander {
  private config: IConfig;
  constructor(config: IConfig) {
    this.config = config;
  }

  public async getContactsCommander(
    secretType: EnumSecretType = EnumSecretType.Contact,
    agentId?: string
  ) {
    const accessToken = await AccessToken.get(this.config, secretType, agentId);
    return new ContactsCommander(accessToken);
  }
}
