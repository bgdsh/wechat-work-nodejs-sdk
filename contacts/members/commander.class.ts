import { CommanderParent, IApiResponse } from "../../core";
import { doGet, doPost } from "../../core/http-helper";
import { Member } from "./member.class";
import { SimpleMember } from "./simple-member.class";
import { EnumTrueFalse } from "./true-false.enum";

export class MembersCommander extends CommanderParent {
  constructor(accessToken: string) {
    super(accessToken);
  }

  public async create(member: Member) {
    const url = `https://qyapi.weixin.qq.com/cgi-bin/user/create?access_token=${
      this.accessToken
    }`;
    const resData = await doPost(url, member);
    return;
  }

  public async findById(userId: string) {
    const url = `https://qyapi.weixin.qq.com/cgi-bin/user/get?access_token=${
      this.accessToken
    }&userid=${userId}`;
    const resData = await doGet(url);
    return resData as Member;
  }

  public async update(member: Member) {
    const url = `https://qyapi.weixin.qq.com/cgi-bin/user/update?access_token=${
      this.accessToken
    }`;
    await doPost(url, member);
    return;
  }

  public async deleteById(userId: string) {
    const url = `https://qyapi.weixin.qq.com/cgi-bin/user/delete?access_token=${
      this.accessToken
    }&userid=${userId}`;
    await doGet(url);
    return;
  }

  public async delete(userIds: string[]) {
    const url = `https://qyapi.weixin.qq.com/cgi-bin/user/batchdelete?access_token=${
      this.accessToken
    }`;
    await doPost(url, { useridlist: userIds });
  }

  public async findByDepartmentSimple(
    departmentId: string,
    fetchChild: EnumTrueFalse
  ) {
    const url = `https://qyapi.weixin.qq.com/cgi-bin/user/simplelist?access_token=${
      this.accessToken
    }&department_id=${departmentId}&fetch_child=${fetchChild}`;
    const response = await doGet(url);
    return response.data.userlist as SimpleMember[];
  }

  public async findByDepartment(
    departmentId: string,
    fetchChild: EnumTrueFalse
  ) {
    const url = `https://qyapi.weixin.qq.com/cgi-bin/user/list?access_token=${
      this.accessToken
    }&department_id=${departmentId}&fetch_child=${fetchChild}`;
    const response = await doGet(url);
    return response.data.userlist as Member[];
  }

  public async convertToOpenId(userId: string) {
    const url = `https://qyapi.weixin.qq.com/cgi-bin/user/convert_to_openid?access_token=ACCESS_TOKEN`;
    const resData = await doPost(url, { userid: userId });
    return resData.openid as string;
  }

  public async convertToUserId(openId: string) {
    const url = `https://qyapi.weixin.qq.com/cgi-bin/user/convert_to_userid?access_token=${
      this.accessToken
    }`;
    const resData = await doPost(url, { openid: openId });
    return resData.openid as string;
  }

  public async internalAuthResult(userId: string) {
    const url = `https://qyapi.weixin.qq.com/cgi-bin/user/authsucc?access_token=${
      this.accessToken
    }&userid=${userId}`;
    const resData = await doGet(url, false);
    return resData.errmsg as string;
  }
}
