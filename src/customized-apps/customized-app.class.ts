import { CustomizedAppSimple } from "./customized-app-simple.class";

export class CustomizedApp extends CustomizedAppSimple {
  public description!: string;
  // tslint:disable-next-line:variable-name
  public allow_userinfos!: any;
  // tslint:disable-next-line:variable-name
  public allow_partys!: any;
  // tslint:disable-next-line:variable-name
  public allow_tags!: any;
  public close!: boolean;
  // tslint:disable-next-line:variable-name
  public redirect_domain!: string;
  // tslint:disable-next-line:variable-name
  public report_location_flag!: string;
  public isreportenter!: string;
  // tslint:disable-next-line:variable-name
  public home_url!: string;

  public constructor(obj: object) {
    super(obj);
    Object.assign(this, obj);
  }

  public get allowedUserIds() {
    return (this.allow_userinfos.user as Array<{ userid: string }>).map(
      uidObj => uidObj.userid
    );
  }

  public get allowedPartyIds() {
    return this.allow_partys.partyid as number[];
  }
}
