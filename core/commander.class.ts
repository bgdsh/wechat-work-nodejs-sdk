import { ContactsCommander } from "../contacts";
import { IConfig } from "./config.interface";

export class Commander {
  private config: IConfig;
  private _contactsCommander?: ContactsCommander;
  constructor(config: IConfig) {
    this.config = config;
  }

  public get contactsCommander() {
    if (!this._contactsCommander) {
      this._contactsCommander = new ContactsCommander(this.getAccessToken());
    }
    return this._contactsCommander;
  }

  private getAccessToken(): any {
    throw new Error("Method not implemented.");
  }
}
