export interface IApp {
  agentId: string;
  agentSecret: string;
}

export interface IConfig {
  cropId: string;
  cropSecret: string;
  contactSecret?: string;
  apps: IApp[];
  getAccessToken: (key: string) => string;
  saveAccessToken: (
    key: string,
    serialized: string,
    ttlSeconds: number
  ) => void;
}
