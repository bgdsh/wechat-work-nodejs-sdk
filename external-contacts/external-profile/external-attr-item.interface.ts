import { EnumExternalAttrType } from "./external-attr-type.enum";

export interface IExternalAttrItem {
  type: EnumExternalAttrType;
  name: string;
  text?: { value: string };
  web?: { url: string; title: string };
  miniprogram?: { appid: string; pagepath: string; title: string };
}
