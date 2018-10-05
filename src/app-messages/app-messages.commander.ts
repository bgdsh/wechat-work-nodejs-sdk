import { doPost } from "../core";
import { AccessToken } from "../core/access-token.class";
import { TextAppMessage } from "./classes/text-app-message.class";
import { TextCardAppMessage } from "./classes/text-card-app-message.class";

export class AppMessagesCommander {
  private accessToken: AccessToken;
  constructor(accessToken: AccessToken) {
    this.accessToken = accessToken;
  }

  public async send(message: TextAppMessage | TextCardAppMessage) {
    await this.accessToken.ensureNotExpired();
    const url = ` https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=${
      this.accessToken.accessToken
    }`;
    const resData = await doPost(url, message);
    return resData;
  }
}
