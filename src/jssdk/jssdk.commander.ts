import { AccessToken, CommanderParent } from "../core";
import { IConfig } from "./../core/config.interface";
import { JsApiTicket } from "./jsapi-ticket.class";

export class JsSdkCommander extends CommanderParent {
  private agentId: string;
  private config: IConfig;

  constructor(accessToken: AccessToken, agentId: string, config: IConfig) {
    super(accessToken);
    this.agentId = agentId;
    this.config = config;
  }

  public async getJsApiTicket() {
    return JsApiTicket.get(this.config, this.agentId, this.accessToken);
  }
}
