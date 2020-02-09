import axios from "axios";
import { IApiResponse } from "../../core";
import { IExternalProfile } from "../../external-contacts";
import { IExtAttr } from "./ext-attr.interface";
import { EnumGender } from "./gender.enum";
import { EnumTrueFalse } from "./true-false.enum";

export class User {
  public userid!: string;
  public name!: string;
  // tslint:disable-next-line:variable-name
  public english_name?: string;
  public mobile?: string;
  public department?: number[];
  public order?: number[];
  public position?: string;
  public gender?: EnumGender;
  public email?: string;
  public isleader?: EnumTrueFalse;
  public enable?: boolean;
  // tslint:disable-next-line:variable-name
  public avatar?: string;
  public telephone?: string;
  public extattr?: IExtAttr;
  // tslint:disable-next-line:variable-name
  public to_invite?: boolean;
  // tslint:disable-next-line:variable-name
  public external_profile?: IExternalProfile;
  // tslint:disable-next-line:variable-name
  public qr_code?: string;

  public constructor(obj: object) {
    Object.assign(this, obj);
  }

  public get userId() {
    return this.userid;
  }

  public set userId(userId: string) {
    this.userid = userId;
  }

  public get englishName() {
    // Maybe this is a TS bug
    return this.english_name || "";
  }

  public set englishName(engName: string) {
    this.english_name = engName;
  }

  public get isLeader() {
    return this.isleader || EnumTrueFalse.False;
  }

  public set isLeader(is: EnumTrueFalse) {
    this.isleader = is;
  }

  public get extAttr() {
    return this.extattr || { attrs: [] };
  }

  public set extAttr(extra: IExtAttr) {
    this.extAttr = extra;
  }

  public get toInvite() {
    return this.to_invite || false;
  }

  public set toInvite(is: boolean) {
    this.to_invite = is;
  }
}
