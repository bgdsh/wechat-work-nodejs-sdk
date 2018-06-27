import { EnumTrueFalse } from "../contacts";

export interface ICustomizedAppConfig {
  agentid: string;
  report_location_flag: EnumTrueFalse;
  logo_mediaid: string;
  name: string;
  description: string;
  redirect_domain: string;
  isreportenter: EnumTrueFalse;
  home_url: string;
}
