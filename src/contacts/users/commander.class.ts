import { AccessToken, CommanderParent, doGet, doPost } from "../../core";
import { AuthScope } from "./auth-scope.enum";
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

  public async getUserInfoByCode(authScope: AuthScope, code: string) {
    await this.accessToken.ensureNotExpired();
    const url = `https://qyapi.weixin.qq.com/cgi-bin/user/getuserinfo?access_token=${
      this.accessToken.accessToken
    }&code=${code}`;
    const resData = await doGet(url, true);
    const userInfoObj: {
      deviceId: string;
      userId?: string;
      openId?: string;
      userTicket?: string;
      expiresIn?: number;
      avatar?: string;
      email?: string;
      gender?: string;
      mobile?: string;
      name?: string;
      qrCode?: string;
    } = {
      deviceId: resData.DeviceId,
      openId: resData.OpenId,
      userId: resData.UserId
    };
    if (authScope === AuthScope.BASE) {
      return userInfoObj;
    }
    userInfoObj.userTicket = resData.user_ticket;
    userInfoObj.expiresIn = resData.expiresIn;
    const detail = await this.getUserDetailByTicket(
      userInfoObj.userTicket as string
    );
    userInfoObj.avatar = detail.avatar;
    userInfoObj.email = resData.email;
    userInfoObj.gender = resData.gender;
    userInfoObj.mobile = resData.mobile;
    userInfoObj.name = resData.name;
    userInfoObj.qrCode = resData.qr_code;
    return userInfoObj;
  }

  // Note: userTicket is different from jsapi_ticket
  public async getUserDetailByTicket(userTicket: string) {
    await this.accessToken.ensureNotExpired();
    const url = `https://qyapi.weixin.qq.com/cgi-bin/user/getuserdetail?access_token=${
      this.accessToken.accessToken
    }`;
    const resData = await doPost(url, { user_ticket: userTicket });
    return {
      avatar: resData.avatar,
      email: resData.email,
      gender: resData.gender,
      mobile: resData.mobile,
      name: resData.name,
      qrCode: resData.qr_code,
      userId: resData.userid
    } as {
      avatar: string;
      email?: string;
      gender: string;
      mobile?: string;
      name: string;
      qrCode: string;
      userId: string;
    };
  }
}
