import { AccessToken, doGet, EnumErrors, IConfig } from "../core";
import { timer } from "../core/common-helpers";
import { ACCESS_TOKEN_EXPIRE_CUTOFF } from "../core/constants";

const fetching: { [key: string]: boolean } = {}; // TODO: multi server
export class JsApiTicket {
  public static async get(
    config: IConfig,
    agentId: string,
    accessToken: AccessToken
  ): Promise<JsApiTicket> {
    // TODO: add a force fetch logic
    const key = JsApiTicket.key(config.cropId, agentId);
    const cachedJsApiTicket = await config.getFromCacheMethod(key);
    if (cachedJsApiTicket && cachedJsApiTicket.content) {
      if (cachedJsApiTicket.ttlSeconds) {
        if (cachedJsApiTicket.ttlSeconds > ACCESS_TOKEN_EXPIRE_CUTOFF) {
          // Externally maintained ttl is valid
          const deSerialized = JsApiTicket.deSerialize(
            cachedJsApiTicket.content,
            accessToken,
            cachedJsApiTicket.ttlSeconds
          );
          deSerialized.config = config;
          return deSerialized;
        }
      } else {
        const deSerialized = JsApiTicket.deSerialize(
          cachedJsApiTicket.content,
          accessToken
        );
        if (deSerialized.expiresIn > 600) {
          deSerialized.config = config;
          // internally maintained ttl is valid
          return deSerialized;
        }
      }
    }
    // cached access token is not valid.
    // So we should fetch from wechat server.
    if (fetching[key] === true) {
      await timer(100);
      return await JsApiTicket.get(config, agentId, accessToken);
    }
    fetching[key] = true;
    const fetched = await JsApiTicket.fetch(config, agentId, accessToken);
    fetched.config = config;
    await config.saveToCacheMethod(
      fetched.key,
      fetched.serialized,
      fetched.expiresIn
    );
    fetching[key] = false;
    return fetched;
  }

  public static deSerialize(
    serialized: string,
    accessToken: AccessToken,
    ttlSeconds?: number
  ) {
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

    return new JsApiTicket(
      splited[2].trim(),
      splited[0].trim(),
      expiresIn,
      splited[4],
      accessToken
    );
  }

  public static async fetch(
    config: IConfig,
    agentId: string,
    accessToken: AccessToken
  ): Promise<JsApiTicket> {
    await accessToken.ensureNotExpired();
    const url = `https://qyapi.weixin.qq.com/cgi-bin/get_jsapi_ticket?access_token=${
      accessToken.accessToken
    }`;
    const resData = (await doGet(url)) as any;
    return new JsApiTicket(
      config.cropId,
      resData.ticket,
      resData.expires_in,
      agentId,
      accessToken
    );
  }

  public static key(cropId: string, agentId: string) {
    return `WECHAT_WORK_JSAPI_TICKET_CROP_${cropId}_AGENT_${agentId}`;
  }

  public cropId: string;
  public ticket: string;
  public expiresIn: number;
  public createdAt: number;
  public expiresAt: number;
  public agentId: string;
  public config?: IConfig;
  public accessToken: AccessToken;

  constructor(
    cropId: string,
    ticket: string,
    expiresIn: number,
    agentId: string,
    accessToken: AccessToken,
    config?: IConfig
  ) {
    this.ticket = ticket;
    this.expiresIn = expiresIn;
    this.createdAt = Date.now();
    this.expiresAt = this.createdAt + this.expiresIn * 1000;
    this.cropId = cropId;
    this.agentId = agentId;
    this.config = config;
    this.accessToken = accessToken;
  }

  public isExpired() {
    return this.expiresAt <= Date.now();
  }

  public get key() {
    return JsApiTicket.key(this.cropId, this.agentId);
  }

  public get serialized() {
    return `${this.ticket}|${this.expiresAt}|${this.cropId}|${this.agentId}`;
  }

  public async ensureNotExpired() {
    if (this.isExpired()) {
      if (!this.config) {
        throw Error(EnumErrors.CONFIG_SHOULD_PROVIDED);
      }

      const token = await JsApiTicket.get(
        this.config,
        this.agentId,
        this.accessToken
      );
      this.ticket = token.ticket;
      this.createdAt = token.createdAt;
      this.expiresAt = token.expiresAt;
      this.expiresIn = token.expiresIn;
    }
  }
}
