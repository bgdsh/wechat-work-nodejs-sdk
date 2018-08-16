import { AccessToken, CommanderParent, doGet, doPost } from "../../core";
import { SimpleUser } from "./simple-user.class";
import { EnumTrueFalse } from "./true-false.enum";
import { User } from "./user.class";

export class UsersCommander extends CommanderParent {
  constructor(accessToken: AccessToken) {
    super(accessToken);
  }

  public async create(member: User) {
    await this.accessToken.ensureNotExpired();
    const url = `https://qyapi.weixin.qq.com/cgi-bin/user/create?access_token=${
      this.accessToken.accessToken
    }`;
    await doPost(url, member);
    return;
  }

  public async findById(userId: string) {
    await this.accessToken.ensureNotExpired();
    const url = `https://qyapi.weixin.qq.com/cgi-bin/user/get?access_token=${
      this.accessToken.accessToken
    }&userid=${userId}`;
    const resData = await doGet(url);
    return resData as User;
  }

  public async update(user: User) {
    await this.accessToken.ensureNotExpired();
    const url = `https://qyapi.weixin.qq.com/cgi-bin/user/update?access_token=${
      this.accessToken.accessToken
    }`;
    await doPost(url, user);
    return;
  }

  public async deleteById(userId: string) {
    await this.accessToken.ensureNotExpired();
    const url = `https://qyapi.weixin.qq.com/cgi-bin/user/delete?access_token=${
      this.accessToken.accessToken
    }&userid=${userId}`;
    await doGet(url);
    return;
  }

  public async delete(userIds: string[]) {
    await this.accessToken.ensureNotExpired();
    const url = `https://qyapi.weixin.qq.com/cgi-bin/user/batchdelete?access_token=${
      this.accessToken.accessToken
    }`;
    await doPost(url, { useridlist: userIds });
  }

  public async findByDepartmentSimple(
    departmentId: string,
    fetchChild: EnumTrueFalse
  ) {
    await this.accessToken.ensureNotExpired();
    const url = `https://qyapi.weixin.qq.com/cgi-bin/user/simplelist?access_token=${
      this.accessToken.accessToken
    }&department_id=${departmentId}&fetch_child=${fetchChild}`;
    const response = await doGet(url);
    return response.data.userlist as SimpleUser[];
  }

  public async findByDepartment(
    departmentId: string,
    fetchChild: EnumTrueFalse
  ) {
    await this.accessToken.ensureNotExpired();
    const url = `https://qyapi.weixin.qq.com/cgi-bin/user/list?access_token=${
      this.accessToken.accessToken
    }&department_id=${departmentId}&fetch_child=${fetchChild}`;
    const response = await doGet(url);
    return response.data.userlist as User[];
  }

  public async convertToOpenId(userId: string) {
    await this.accessToken.ensureNotExpired();
    const url = `https://qyapi.weixin.qq.com/cgi-bin/user/convert_to_openid?access_token=${
      this.accessToken.accessToken
    }`;
    const resData = await doPost(url, { userid: userId });
    return resData.openid as string;
  }

  public async convertToUserId(openId: string) {
    await this.accessToken.ensureNotExpired();
    const url = `https://qyapi.weixin.qq.com/cgi-bin/user/convert_to_userid?access_token=${
      this.accessToken.accessToken
    }`;
    const resData = await doPost(url, { openid: openId });
    return resData.openid as string;
  }

  public async internalAuthResult(userId: string) {
    await this.accessToken.ensureNotExpired();
    const url = `https://qyapi.weixin.qq.com/cgi-bin/user/authsucc?access_token=${
      this.accessToken.accessToken
    }&userid=${userId}`;
    const resData = await doGet(url, false);
    return resData.errmsg as string;
  }
}
