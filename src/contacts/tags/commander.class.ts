import { AccessToken, CommanderParent, doGet, doPost } from "../../core";
import { SimpleUser } from "../users";
import { IInvalid } from "./invalid.interface";
import { Tag } from "./tag.class";

export class TagsCommander extends CommanderParent {
  constructor(accessToken: AccessToken) {
    super(accessToken);
  }

  public async find() {
    await this.accessToken.ensureNotExpired();
    const url = `https://qyapi.weixin.qq.com/cgi-bin/tag/list?access_token=${
      this.accessToken.accessToken
    }`;
    const resData = await doGet(url);
    return (resData.taglist as any[]).map(
      tagObj => new Tag(tagObj.tagname, tagObj.tagid)
    );
  }

  public async create(tag: Tag) {
    await this.accessToken.ensureNotExpired();
    const url = `https://qyapi.weixin.qq.com/cgi-bin/tag/update?access_token=${
      this.accessToken.accessToken
    }`;
    const resData = await doPost(url, tag);
    tag.id = resData.tagid;
    return tag;
  }

  public async update(tag: Tag) {
    await this.accessToken.ensureNotExpired();
    const url = `https://qyapi.weixin.qq.com/cgi-bin/tag/update?access_token=${
      this.accessToken.accessToken
    }`;
    await doPost(url, tag);
  }

  public async delete(id: number) {
    await this.accessToken.ensureNotExpired();
    const url = `https://qyapi.weixin.qq.com/cgi-bin/tag/delete?access_token=${
      this.accessToken.accessToken
    }&tagid=${id}`;
    await doGet(url);
  }

  public async findBindings(tagId: number) {
    await this.accessToken.ensureNotExpired();
    const url = `https://qyapi.weixin.qq.com/cgi-bin/tag/get?access_token=${
      this.accessToken.accessToken
    }&tagid=${tagId}`;
    const resData = await doGet(url);
    return {
      departmentIdList: resData.partylist as number[],
      memberList: resData.userlist as SimpleUser[],
      tag: new Tag(resData.tagname, tagId)
    };
  }

  public async addBindings(
    tagId: number,
    memberIds: string[],
    departmentIds: number[]
  ) {
    await this.accessToken.ensureNotExpired();
    const url = `https://qyapi.weixin.qq.com/cgi-bin/tag/addtagusers?access_token=${
      this.accessToken.accessToken
    }`;
    const resData = await doPost(url, {
      partylist: departmentIds,
      tagid: tagId,
      userlist: memberIds
    });
    return {
      invalidDepartmentIds:
        (resData.invalidparty as number[]) || ([] as number[]),
      invalidMemberIds: resData.invalidlist
        ? (resData.invalidlist as string).split("|")
        : ([] as string[])
    } as IInvalid;
  }

  public async removeBindings(
    tagId: number,
    memberIds: string[],
    departmentIds: number[]
  ) {
    await this.accessToken.ensureNotExpired();
    const url = `https://qyapi.weixin.qq.com/cgi-bin/tag/deltagusers?access_token=${
      this.accessToken.accessToken
    }`;
    const resData = await doPost(url, {
      partylist: departmentIds,
      tagid: tagId,
      userlist: memberIds
    });
    return {
      invalidDepartmentIds:
        (resData.invalidparty as number[]) || ([] as number[]),
      invalidMemberIds: resData.invalidlist
        ? (resData.invalidlist as string).split("|")
        : ([] as string[])
    } as IInvalid;
  }
}
