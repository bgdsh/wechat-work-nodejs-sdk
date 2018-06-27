import { CustomizedApp, CustomizedAppSimple, ICustomizedAppConfig } from ".";
import { AccessToken, CommanderParent, doGet, doPost } from "../core";

export class CustomizedAppsCommander extends CommanderParent {
  constructor(accessToken: AccessToken) {
    super(accessToken);
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
}
