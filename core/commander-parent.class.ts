import { AccessToken } from "./access-token.class";

export class CommanderParent {
  protected accessToken: AccessToken;
  constructor(accessToken: AccessToken) {
    this.accessToken = accessToken;
  }
}
