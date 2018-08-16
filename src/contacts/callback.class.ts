export class Callback {
  public url: string;
  public token: string;
  public encodingaeskey: string;

  constructor(url: string, token: string, encodingAESKey: string) {
    this.url = url;
    this.token = token;
    this.encodingaeskey = encodingAESKey;
  }

  public get encodingAESKey() {
    return this.encodingaeskey;
  }

  public set encodingAESKey(key: string) {
    this.encodingaeskey = key;
  }
}
