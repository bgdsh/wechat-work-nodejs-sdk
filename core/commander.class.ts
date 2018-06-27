import { ContactsCommander } from "../contacts";
import { ExternalContactCommander } from "../external-contacts";
import { AccessToken } from "./access-token.class";
import { IConfig } from "./config.interface";
import { EnumSecretType } from "./secret-type.enum";

export class Commander {
  private config: IConfig;
  private _externalContactsCommander?: ExternalContactCommander;
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

  public async getExternalContactsCommander() {
    if (this._externalContactsCommander === undefined) {
      const accessToken = await AccessToken.get(
        this.config,
        EnumSecretType.ExternalContact
      );
      this._externalContactsCommander = new ExternalContactCommander(
        accessToken
      );
    }
    return this._externalContactsCommander;
  }
}
