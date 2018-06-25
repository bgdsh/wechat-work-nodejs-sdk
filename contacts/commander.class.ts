import { AccessToken } from "../core";
import { DepartmentsCommander } from "./departments";
import { MembersCommander } from "./members";
import { TagsCommander } from "./tags";

export class ContactsCommander {
  public accessToken: AccessToken;
  private _departments?: DepartmentsCommander;
  private _tags?: TagsCommander;
  private _members?: MembersCommander;
  constructor(accessToken: AccessToken) {
    this.accessToken = accessToken;
  }

  public get departments() {
    if (!this._departments) {
      this._departments = new DepartmentsCommander(this.accessToken);
    }
    return this._departments;
  }

  public get members() {
    if (!this._members) {
      this._members = new MembersCommander(this.accessToken);
    }
    return this._members;
  }

  public get tags() {
    if (!this._tags) {
      this._tags = new TagsCommander(this.accessToken);
    }
    return this._tags;
  }
}
