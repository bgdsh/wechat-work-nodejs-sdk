import { ContactsCommander } from "../contacts";
import { IConfig } from "./config.interface";
import { EnumSecretType } from "./secret-type.enum";

export class Commander {
  private config: IConfig;
  constructor(config: IConfig) {
    this.config = config;
  }

  public getContactsCommander(
    secretType: EnumSecretType = EnumSecretType.Contact,
    agentId?: string
  ) {
    return new ContactsCommander(this.getAccessToken(secretType, agentId));
  }

  private getAccessToken(secretType?: EnumSecretType, agentId?: string): any {
    throw new Error("Method not implemented.");
  }
}
