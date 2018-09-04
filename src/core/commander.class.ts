import { AccessToken, EnumSecretType, IConfig } from ".";
import { ContactsCommander } from "../contacts";
import { CustomizedAppsCommander } from "../customized-apps";
import { ExternalContactCommander } from "../external-contacts";
import { JsSdkCommander } from "../jssdk";

export class Commander {
  private config: IConfig;
  constructor(config: IConfig) {
    this.config = config;
  }

  // TODO: clarify the SecretType
  public async getContactsCommander(
    secretType: EnumSecretType = EnumSecretType.Contact
  ) {
    const accessToken = await AccessToken.get(this.config, secretType);
    return new ContactsCommander(accessToken);
  }

  public async getExternalContactsCommander() {
    const accessToken = await AccessToken.get(
      this.config,
      EnumSecretType.ExternalContact
    );
    return new ExternalContactCommander(accessToken);
  }

  public async getAccessToken(secretType: EnumSecretType, agentId?: string) {
    return AccessToken.get(this.config, secretType, agentId);
  }

  public async getCustomizedAppCommander(agentId: string) {
    const accessToken = await AccessToken.get(
      this.config,
      EnumSecretType.Agent,
      agentId
    );
    return new CustomizedAppsCommander(accessToken);
  }

  public async getJsSdkCommander(agentId: string) {
    const accessToken = await AccessToken.get(
      this.config,
      EnumSecretType.Agent,
      agentId
    );
    return new JsSdkCommander(accessToken, agentId, this.config);
  }
}
