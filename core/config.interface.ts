export interface IApp {
  agentId: string;
  agentSecret: string;
}

export interface IConfig {
  cropId: string;
  contactSecret?: string;
  apps: IApp[];
  getAccessToken: (
    key: string
  ) => Promise<{ ttlSeconds?: number; content: string }>;
  saveAccessToken: (
    key: string,
    serialized: string,
    ttlSeconds: number
  ) => Promise<void>;
}
