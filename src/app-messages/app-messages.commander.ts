import { AccessToken, doPost } from "../core";
import { ImageAppMessage, NewsAppMessage, TextAppMessage, TextCardAppMessage } from "./classes";

export class AppMessagesCommander {
  private accessToken: AccessToken;
  constructor(accessToken: AccessToken) {
    this.accessToken = accessToken;
  }

  public async send(message: TextAppMessage | TextCardAppMessage | NewsAppMessage | ImageAppMessage) {
    await this.accessToken.ensureNotExpired();
    const url = ` https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=${
      this.accessToken.accessToken
      }`;
    const resData: {
      invaliduser: string,
      invalidparty: string,
      invalidtag: string
    } = await doPost(url, message);
    return {
      invalidDepartmentIds: resData.invalidparty && resData.invalidparty.split("|"),
      invalidTags: resData.invalidtag && resData.invalidtag.split("|"),
      invalidUserIds: resData.invalidtag && resData.invaliduser.split("|"),
    };
  }
}
