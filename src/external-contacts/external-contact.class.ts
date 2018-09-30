import { EnumGender } from "../contacts";
import { IExternalProfile } from "./external-profile";
import { EnumExternalUserType } from "./external-user-type.enum";

export class ExternalUser {
  // tslint:disable-next-line:variable-name
  public external_userid!: string;
  public position!: string;
  public avatar!: string;
  // tslint:disable-next-line:variable-name
  public corp_name!: string;
  // tslint:disable-next-line:variable-name
  public corp_full_name!: string;

  public type!: EnumExternalUserType;

  public gender!: EnumGender;

  public unionid!: string;
  // tslint:disable-next-line:variable-name
  public external_profile!: IExternalProfile;

  public get externalUserId() {
    return this.external_userid;
  }
  public set externalUserId(uid: string) {
    this.external_userid = uid;
  }

  public get corpName() {
    return this.corp_name;
  }
  public set corpName(name: string) {
    this.corp_name = name;
  }

  public get corpFullName() {
    return this.corp_full_name;
  }
  public set corpFullName(name: string) {
    this.corp_full_name = name;
  }

  public get unionId() {
    return this.unionid;
  }
  public set unionId(id: string) {
    this.unionid = id;
  }

  public get externalProfile() {
    return this.external_profile;
  }
  public set externalProfile(profile: IExternalProfile) {
    this.external_profile = profile;
  }
}
