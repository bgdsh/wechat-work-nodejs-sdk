import { EnumGender } from "../contacts";
import { IExternalProfile } from "./external-profile";
import { EnumExternalUserType } from "./external-user-type.enum";

export class ExternalUser {
  // tslint:disable-next-line:variable-name
  public external_userid!: string;
  public position!: string;
  public avatar!: string;
  // tslint:disable-next-line:variable-name
  public crop_name!: string;
  // tslint:disable-next-line:variable-name
  public crop_full_name!: string;

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

  public get cropName() {
    return this.crop_name;
  }
  public set cropName(name: string) {
    this.crop_name = name;
  }

  public get cropFullName() {
    return this.crop_full_name;
  }
  public set cropFullName(name: string) {
    this.crop_full_name = name;
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
