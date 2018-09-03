import Chance from "chance";
import sha1 from "sha1";
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

  public async getSignature(url: string) {
    const chance = new Chance();
    const nonceStr = chance.string({
      length: 16,
      pool: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    });
    const timestamp = Date.now();
    const jsApiTicket = await this.getJsApiTicket();
    const ticket = jsApiTicket.ticket;
    const signature = sha1(
      `jsapi_ticket=${ticket}&noncestr=${nonceStr}&timestamp=${timestamp}&url=${url}`
    ) as string;
    return { signature, timestamp, nonceStr };
  }
}
