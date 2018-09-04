import { Callback } from ".";
import { AccessToken, doGet, doPost, EnumErrors } from "../core";
import { DepartmentsCommander } from "./departments";
import { IInvalid, TagsCommander } from "./tags";
import { UsersCommander } from "./users";

export class ContactsCommander {
  public accessToken: AccessToken;
  private _departments?: DepartmentsCommander;
  private _tags?: TagsCommander;
  private _users?: UsersCommander;
  constructor(accessToken: AccessToken) {
    this.accessToken = accessToken;
  }

  public get departments() {
    if (!this._departments) {
      this._departments = new DepartmentsCommander(this.accessToken);
    }
    return this._departments;
  }

  public get users() {
    if (!this._users) {
      this._users = new UsersCommander(this.accessToken);
    }
    return this._users;
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

  public async batchAddMembers(
    mediaId: string,
    toInvite: boolean = true,
    callback?: Callback
  ) {
    await this.accessToken.ensureNotExpired();
    const url = `https://qyapi.weixin.qq.com/cgi-bin/batch/syncuser?access_token=${
      this.accessToken.accessToken
    }`;
    const resData = await doPost(url, {
      media_id: mediaId,
      to_invite: toInvite,
      callback
    });
    return resData.jobid as string;
  }

  public async batchReplaceMembers(
    mediaId: string,
    toInvite: boolean = true,
    callback?: Callback
  ) {
    await this.accessToken.ensureNotExpired();
    const url = `https://qyapi.weixin.qq.com/cgi-bin/batch/replaceuser?access_token=${
      this.accessToken.accessToken
    }`;
    const resData = await doPost(url, {
      media_id: mediaId,
      to_invite: toInvite,
      callback
    });
    return resData.jobid as string;
  }

  public async batchReplaceDepartments(mediaId: string, callback?: Callback) {
    await this.accessToken.ensureNotExpired();
    const url = `https://qyapi.weixin.qq.com/cgi-bin/batch/replaceparty?access_token=${
      this.accessToken.accessToken
    }`;
    const resData = await doPost(url, {
      media_id: mediaId,
      callback
    });
    return resData.jobid as string;
  }

  public async getBatchResult(jobId: string) {
    await this.accessToken.ensureNotExpired();
    const url = `https://qyapi.weixin.qq.com/cgi-bin/batch/getresult?access_token=${
      this.accessToken.accessToken
    }&jobid=${jobId}`;
    const resData = await doGet(url);
    return resData as {
      status: number;
      type: string;
      total: number;
      percentage: number;
      result: any[];
    };
  }
}
