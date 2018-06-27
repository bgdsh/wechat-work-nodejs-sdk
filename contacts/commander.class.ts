import { AccessToken, doPost, EnumErrors } from "../core";
import { DepartmentsCommander } from "./departments";
import { MembersCommander } from "./members";
import { IInvalid, TagsCommander } from "./tags";

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

  public async invite(
    memberIds?: string[],
    departmentIds?: number[],
    tagIds?: number[]
  ) {
    if (
      (!memberIds || memberIds.length === 0) &&
      (!departmentIds || departmentIds.length === 0) &&
      (!tagIds || tagIds.length === 0)
    ) {
      throw Error(EnumErrors.INVITE_PARAMETERS_ALL_UNDEFINED);
    }
    await this.accessToken.ensureNotExpired();
    const url = `https://qyapi.weixin.qq.com/cgi-bin/batch/invite?access_token=${
      this.accessToken.accessToken
    }`;
    const resData = await doPost(url, {
      party: departmentIds,
      tag: tagIds,
      user: memberIds
    });
    return {
      invalidDepartmentIds: resData.invalidparty,
      invalidMemberIds: resData.invaliduser,
      invalidTagIds: resData.invalidtag
    } as IInvalid;
  }
}
