import { doGet } from "./http-helper";

export class AccessToken {
  public static deSerialize(serialized: string, ttlSeconds?: number) {
    if (!serialized) {
      throw Error("serialized access token can not be an empty string.");
    }
    const splited = serialized.split("|");
    if (splited.length !== 4) {
      throw Error("invalid serialized access token.");
    }

    const expiresIn = ttlSeconds
      ? ttlSeconds
      : (Date.now() - parseInt(splited[1], 10)) / 1000;
    return new AccessToken(splited[2], splited[0], expiresIn, splited[3]);
  }

  public static async fetch(
    cropId: string,
    secret: string,
    agentId?: string
  ): Promise<AccessToken> {
    const resData = (await doGet(
      `https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${cropId}&corpsecret=${secret}`
    )) as any;
    return new AccessToken(
      cropId,
      resData.access_token,
      resData.expires_in,
      agentId
    );
  }

  public static key(cropId: string, agentId?: string) {
    let key = `WECHAT_WORK_ACCESS_TOKEN:${cropId}`;
    if (agentId) {
      key += `:${agentId}`;
    }
    return key;
  }

  public cropId: string;
  public accessToken: string;
  public expiresIn: number;
  public createdAt: number;
  public expiresAt: number;
  public agentId?: string;

  constructor(
    cropId: string,
    accessToken: string,
    expiresIn: number,
    agentId?: string
  ) {
    this.accessToken = accessToken;
    this.expiresIn = expiresIn;
    this.createdAt = Date.now();
    this.expiresAt = this.createdAt + this.expiresIn * 1000;
    this.cropId = cropId;
    this.agentId = agentId;
  }

  public isExpired() {
    return this.expiresAt <= Date.now();
  }

  public get key() {
    return AccessToken.key(this.cropId, this.cropId);
  }

  public get serialized() {
    return `${this.accessToken}|${this.expiresAt}|${this.cropId}|${
      this.agentId
    }`;
  }
}
