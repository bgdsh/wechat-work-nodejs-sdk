import { AccessToken, CommanderParent, doGet } from "../core";
import { ExternalContactDetail } from "./external-contact-detail.class";

export class ExternalContactCommander extends CommanderParent {
  constructor(accessToken: AccessToken) {
    super(accessToken);
  }

  public async find(externalUserId: string) {
    await this.accessToken.ensureNotExpired();
    const url = `https://qyapi.weixin.qq.com/cgi-bin/crm/get_external_contact?access_token=${
      this.accessToken.accessToken
    }&external_userid=${externalUserId}`;
    const resData = await doGet(url);
    return resData as ExternalContactDetail;
  }
}
