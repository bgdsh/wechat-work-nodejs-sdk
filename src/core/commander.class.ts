import { AccessToken, EnumSecretType, IConfig } from ".";
import { AppMessagesCommander } from "../app-messages";
import { ContactsCommander } from "../contacts";
import { CustomizedAppsCommander } from "../customized-apps";
import { ExternalContactCommander } from "../external-contacts";
import { JsSdkCommander } from "../jssdk";
import { MiniProgramCommander } from "../mini-programs/mini-programs.commander.class";
import { MediaCommander } from "./../media/media-commander";

export class Commander {
  private config: IConfig;
  constructor(config: IConfig) {
    this.config = config;
  }

  // TODO: clarify the SecretType
  public async getContactsCommander(
    secretType: EnumSecretType = EnumSecretType.Contact,
    agentId?: string,
  ) {
    const accessToken = await AccessToken.getInstance(this.config, secretType, agentId);
    return new ContactsCommander(accessToken);
  }

  public async getExternalContactsCommander() {
    const accessToken = await AccessToken.getInstance(
      this.config,
      EnumSecretType.ExternalContact
    );
    return new ExternalContactCommander(accessToken);
  }

  public async getAccessToken(secretType: EnumSecretType, agentId?: string) {
    return AccessToken.getInstance(this.config, secretType, agentId);
  }

  public async getCustomizedAppCommander(agentId: string) {
    const accessToken = await AccessToken.getInstance(
      this.config,
      EnumSecretType.Agent,
      agentId
    );
    return new CustomizedAppsCommander(accessToken, agentId);
  }

  public async getMiniProgramCommander(agentId: string) {
    const accessToken = await AccessToken.getInstance(this.config, EnumSecretType.Agent, agentId);
    return new MiniProgramCommander(accessToken);
  }

  public async getJsSdkCommander(agentId: string) {
    const accessToken = await AccessToken.getInstance(
      this.config,
      EnumSecretType.Agent,
      agentId
    );
    return new JsSdkCommander(accessToken, agentId, this.config);
  }

  public async getAppMessagesCommander(agentId: string) {
    const accessToken = await AccessToken.getInstance(
      this.config,
      EnumSecretType.Agent,
      agentId
    );
    return new AppMessagesCommander(accessToken);
  }

  public async getMediaCommander(agentId: string) {
    const accessToken = await AccessToken.getInstance(
      this.config,
      EnumSecretType.Agent,
      agentId
    );
    return new MediaCommander(accessToken);
  }
}
