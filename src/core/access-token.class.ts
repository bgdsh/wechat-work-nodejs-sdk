import { timer } from "./common-helpers";
import { IConfig } from "./config.interface";
import { ACCESS_TOKEN_EXPIRE_CUTOFF } from "./constants";
import { EnumErrors } from "./errors.enum";
import { doGet } from "./http-helper";
import { EnumSecretType } from "./secret-type.enum";

const fetching: { [key: string]: boolean } = {}; // TODO: multi server
export class AccessToken {
  public static async get(
    config: IConfig,
    secretType: EnumSecretType,
    agentId?: string
  ): Promise<AccessToken> {
    // TODO: add a force fetch logic
    const key = AccessToken.key(config.corpId, secretType, agentId);
    const cachedAccessToken = await config.getFromCacheMethod(key);
    if (cachedAccessToken && cachedAccessToken.content) {
      if (cachedAccessToken.ttlSeconds) {
        if (cachedAccessToken.ttlSeconds > ACCESS_TOKEN_EXPIRE_CUTOFF) {
          // Externally maintained ttl is valid
          const deSerialized = AccessToken.deSerialize(
            cachedAccessToken.content,
            cachedAccessToken.ttlSeconds
          );
          deSerialized.config = config;
          return deSerialized;
        }
      } else {
        const deSerialized = AccessToken.deSerialize(cachedAccessToken.content);
        if (deSerialized.expiresIn > 600) {
          deSerialized.config = config;
          deSerialized.secretType = secretType;
          // internally maintained ttl is valid
          return deSerialized;
        }
      }
    }
    // cached access token is not valid.
    // So we should fetch from wechat server.
    if (fetching[key] === true) {
      await timer(100);
      return await AccessToken.get(config, secretType, agentId);
    }
    fetching[key] = true;
    const fetched = await AccessToken.fetch(
      config.corpId,
      AccessToken.getSecret(config, secretType, agentId),
      secretType,
      agentId
    );
    fetched.config = config;
    await config.saveToCacheMethod(
      fetched.key,
      fetched.serialized,
      fetched.expiresIn
    );
    fetching[key] = false;
    return fetched;
  }

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
      : (parseInt(splited[1], 10) - Date.now()) / 1000;

    return new AccessToken(
      splited[2].trim(),
      splited[0].trim(),
      expiresIn,
      parseInt(splited[3], 10),
      splited[4]
    );
  }

  public static async fetch(
    corpId: string,
    secret: string,
    secretType: EnumSecretType,
    agentId?: string
  ): Promise<AccessToken> {
    const url = `https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${corpId}&corpsecret=${secret}`;
    const resData = (await doGet(url)) as any;
    return new AccessToken(
      corpId,
      resData.access_token,
      resData.expires_in,
      secretType,
      agentId
    );
  }

  public static key(
    corpId: string,
    secretType: EnumSecretType,
    agentId?: string
  ) {
    // tslint:disable-next-line:no-console
    console.log("secretType: ", secretType);
    let key = `WECHAT_WORK_ACCESS_TOKEN:${corpId}`;
    switch (secretType) {
      case EnumSecretType.Contact:
        key += ":Contact";
        break;
      case EnumSecretType.ExternalContact:
        key += ":ExternalContact";
        break;
      case EnumSecretType.Agent:
        if (!agentId) {
          throw Error(EnumErrors.AGENT_ID_SHOULD_PROVIDED);
        }
        key += ":AGENT:" + agentId;
        break;
      default:
        throw Error(EnumErrors.SECRET_TYPE_NOT_SUPPORTED);
    }
    return key;
  }

  private static getSecret(
    config: IConfig,
    secretType: EnumSecretType,
    agentId?: string
  ) {
    let secret = "";
    switch (secretType) {
      case EnumSecretType.Contact:
        if (config.contactSecret === undefined) {
          throw Error(EnumErrors.CONTACT_SECRET_SHOULD_PROVIDED);
        }
        secret = config.contactSecret;
        break;
      case EnumSecretType.ExternalContact:
        if (config.externalContactSecret === undefined) {
          throw Error(EnumErrors.EXTERNAL_CONTACT_SECRET_SHOULD_PROVIDED);
        }
        secret = config.externalContactSecret;
        break;
      case EnumSecretType.Agent:
        const pair = config.apps.filter(app => app.agentId === agentId);
        if (pair.length === 0) {
          throw Error(EnumErrors.AGENT_NOT_CONFIGURED);
        }
        secret = pair[0].agentSecret;
        break;
      default:
        throw Error(EnumErrors.SECRET_TYPE_NOT_SUPPORTED);
    }
    return secret;
  }

  public corpId: string;
  public accessToken: string;
  public expiresIn: number;
  public createdAt: number;
  public expiresAt: number;
  public secretType: EnumSecretType;
  public agentId?: string;
  public config?: IConfig;

  constructor(
    corpId: string,
    accessToken: string,
    expiresIn: number,
    secretType: EnumSecretType,
    agentId?: string,
    config?: IConfig
  ) {
    this.accessToken = accessToken;
    this.expiresIn = expiresIn;
    this.createdAt = Date.now();
    this.expiresAt = this.createdAt + this.expiresIn * 1000;
    this.corpId = corpId;
    this.agentId = agentId;
    this.secretType = secretType;
    this.config = config;
  }

  public isExpired() {
    return this.expiresAt <= Date.now();
  }

  public get key() {
    return AccessToken.key(this.corpId, this.secretType, this.agentId);
  }

  public get serialized() {
    return `${this.accessToken}|${this.expiresAt}|${this.corpId}|${
      this.agentId
    }`;
  }

  public async ensureNotExpired() {
    if (this.isExpired()) {
      if (!this.config) {
        throw Error(EnumErrors.CONFIG_SHOULD_PROVIDED);
      }
      const token = await AccessToken.get(
        this.config,
        this.secretType,
        this.agentId
      );
      this.accessToken = token.accessToken;
      this.createdAt = token.createdAt;
      this.expiresAt = token.expiresAt;
      this.expiresIn = token.expiresIn;
    }
  }
}
