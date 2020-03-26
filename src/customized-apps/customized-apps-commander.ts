import {
  AuthScope,
  CustomizedApp,
  CustomizedAppSimple,
  ICustomizedAppConfig
} from ".";
import { AccessToken, CommanderParent, doGet, doPost } from "../core";

import debug from "debug";
const debugThis = debug("wechat-work:customized-apps-commander");

export class CustomizedAppsCommander extends CommanderParent {
  private agentId: string;
  constructor(accessToken: AccessToken, agentId: string) {
    super(accessToken);
    this.agentId = agentId;
  }
  public async findById(agentId: string) {
    await this.accessToken.ensureNotExpired();
    const url = `https://qyapi.weixin.qq.com/cgi-bin/agent/get?access_token=${
      this.accessToken.accessToken
      }&agentid=${agentId}`;
    const resData = await doGet(url);
    return new CustomizedApp(resData);
  }

  public async config(config: ICustomizedAppConfig) {
    await this.accessToken.ensureNotExpired();
    const url = `https://qyapi.weixin.qq.com/cgi-bin/agent/set?access_token=${
      this.accessToken.accessToken
      }`;
    await doPost(url, config);
  }

  public async find() {
    await this.accessToken.ensureNotExpired();
    const url = `https://qyapi.weixin.qq.com/cgi-bin/agent/list?access_token=${
      this.accessToken.accessToken
      }`;
    const resData = await doGet(url);
    return (resData.agentlist as any[]).map(
      obj => new CustomizedAppSimple(obj)
    );
  }

  public async getUserInfoByCode(authScope: AuthScope, code: string) {
    debugThis("authScope in getUserInfoByCode: %s", authScope);
    debugThis("code in getUserInfoByCode: %s", code);
    await this.accessToken.ensureNotExpired();
    const url = `https://qyapi.weixin.qq.com/cgi-bin/user/getuserinfo?access_token=${
      this.accessToken.accessToken
      }&code=${code}`;
    const resData = await doGet(url, true);
    return {
      deviceId: resData.DeviceId,
      openId: resData.OpenId,
      userId: resData.UserId
    };
  }

  // Note: userTicket is different from jsapi_ticket
  public async getUserDetailByTicket(userTicket: string) {
    await this.accessToken.ensureNotExpired();
    const url = `https://qyapi.weixin.qq.com/cgi-bin/user/getuserdetail?access_token=${
      this.accessToken.accessToken
      }`;
    const resData = await doPost(url, { user_ticket: userTicket });
    debugThis("resData in get user detail by ticket: %j", resData);
    return {
      avatar: resData.avatar,
      email: resData.email,
      gender: resData.gender,
      mobile: resData.mobile,
      name: resData.name,
      qrCode: resData.qr_code,
      userId: resData.userid
    } as {
      avatar: string;
      email?: string;
      gender: string;
      mobile?: string;
      name: string;
      qrCode: string;
      userId: string;
    };
  }
}
