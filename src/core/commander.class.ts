import { AccessToken, EnumSecretType, IConfig } from ".";
import { ContactsCommander } from "../contacts";
import { CustomizedAppsCommander } from "../customized-apps";
import { ExternalContactCommander } from "../external-contacts";

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

  public async getExternalContactsCommander() {
    const accessToken = await AccessToken.get(
      this.config,
      EnumSecretType.ExternalContact
    );
    return new ExternalContactCommander(accessToken);
  }

  public async getCustomizedAppCommander() {
    const accessToken = await AccessToken.get(
      this.config,
      EnumSecretType.ExternalContact
    );
    return new CustomizedAppsCommander(accessToken);
  }
}
