import {
  AuthScope,
  CustomizedApp,
  CustomizedAppSimple,
  ICustomizedAppConfig
} from ".";
import { AccessToken, CommanderParent, doGet, doPost } from "../core";

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
    await this.accessToken.ensureNotExpired();
    const url = `https://qyapi.weixin.qq.com/cgi-bin/user/getuserinfo?access_token=${
      this.accessToken.accessToken
    }&code=${code}`;
    const resData = await doGet(url, true);
    const userInfoObj: {
      deviceId: string;
      userId?: string;
      openId?: string;
      userTicket?: string;
      expiresIn?: number;
      avatar?: string;
      email?: string;
      gender?: string;
      mobile?: string;
      name?: string;
      qrCode?: string;
    } = {
      deviceId: resData.DeviceId,
      openId: resData.OpenId,
      userId: resData.UserId
    };
    if (authScope === AuthScope.BASE) {
      return userInfoObj;
    }
    userInfoObj.userTicket = resData.user_ticket;
    userInfoObj.expiresIn = resData.expiresIn;
    const detail = await this.getUserDetailByTicket(
      userInfoObj.userTicket as string
    );
    userInfoObj.avatar = detail.avatar;
    userInfoObj.email = resData.email;
    userInfoObj.gender = resData.gender;
    userInfoObj.mobile = resData.mobile;
    userInfoObj.name = resData.name;
    userInfoObj.qrCode = resData.qr_code;
    return userInfoObj;
  }

  // Note: userTicket is different from jsapi_ticket
  public async getUserDetailByTicket(userTicket: string) {
    await this.accessToken.ensureNotExpired();
    const url = `https://qyapi.weixin.qq.com/cgi-bin/user/getuserdetail?access_token=${
      this.accessToken.accessToken
    }`;
    const resData = await doPost(url, { user_ticket: userTicket });
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
