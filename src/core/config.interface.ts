export interface IApp {
  agentId: string;
  agentSecret: string;
}

export interface IConfig {
  corpId: string;
  contactSecret?: string;
  externalContactSecret?: string;
  apps: IApp[];
  getFromCacheMethod: (
    key: string
  ) => Promise<{ ttlSeconds?: number; content: string }>;
  saveToCacheMethod: (
    key: string,
    serialized: string,
    ttlSeconds: number
  ) => Promise<void>;
}
