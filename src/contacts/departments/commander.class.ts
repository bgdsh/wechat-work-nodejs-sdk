import {
  AccessToken,
  CommanderParent,
  doGet,
  doPost,
  EnumErrors
} from "../../core";
import { Department } from "./department.class";

export class DepartmentsCommander extends CommanderParent {
  constructor(accessToken: AccessToken) {
    super(accessToken);
  }

  public async create(department: Department) {
    await this.accessToken.ensureNotExpired();
    const url = `https://qyapi.weixin.qq.com/cgi-bin/department/create?access_token=${
      this.accessToken.accessToken
    }`;
    const resData = await doPost(url, department);
    department.id = resData.id;
    return department;
  }

  public async update(department: Department) {
    if (!department.id) {
      throw Error(EnumErrors.DEPARTMENT_ID_SHOULD_PROVIDED);
    }
    await this.accessToken.ensureNotExpired();
    const url = `https://qyapi.weixin.qq.com/cgi-bin/department/update?access_token=${
      this.accessToken.accessToken
    }`;
    await doPost(url, department);
  }

  public async delete(id: number) {
    await this.accessToken.ensureNotExpired();
    const url = `https://qyapi.weixin.qq.com/cgi-bin/department/delete?access_token=${
      this.accessToken.accessToken
    }&id=${id}`;
    await doGet(url);
  }

  public async find(parentId?: number) {
    await this.accessToken.ensureNotExpired();
    let url = `https://qyapi.weixin.qq.com/cgi-bin/department/list?access_token=${
      this.accessToken.accessToken
    }`;
    if (parentId) {
      url += `&id=${parentId}`;
    }
    const resData = await doGet(url);
    return resData.department as Department[];
  }
}
