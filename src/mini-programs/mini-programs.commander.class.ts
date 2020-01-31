import { AccessToken } from "../core/access-token.class";
import { doGet } from "../core/http-helper";

export class MiniProgramCommander {
    public _accessToken: AccessToken;
    constructor(accessToken: AccessToken) {
        this._accessToken = accessToken;
    }

    public async code2Session(code: string) {
        await this._accessToken.ensureNotExpired();
        const url = `https://qyapi.weixin.qq.com/cgi-bin/miniprogram/jscode2session?access_token=${this._accessToken.accessToken}&js_code=${code}&grant_type=authorization_code`;
        const resData = await doGet(url);
        return {
            corpId: resData.corpid as string,
            sessionKey: resData.session_key as string,
            userId: resData.userid as string,
        };
    }
}
