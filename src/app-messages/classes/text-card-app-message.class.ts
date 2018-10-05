import { EnumAppMessageType } from "../enums/app-message-type.enum";
import { EnumSafe } from "../enums/safe.enum";
import { AppMessageBase } from "./app-message-base.class";

export class TextCardAppMessage extends AppMessageBase {
  public textcard: {
    title: string;
    description: string;
    url: string;
    btntxt: string;
  };
  constructor(
    title: string,
    description: string,
    url: string,
    btnText: string,
    agentId: number,
    targetUserIds?: string[],
    targetDepartmentIds?: string[],
    targetTags?: string[],
    safe?: EnumSafe
  ) {
    if (!targetUserIds && !targetDepartmentIds && !targetTags) {
      throw Error(
        "one of targetUserIds,targetDepartmentIds,targetTags should be set."
      );
    }
    super(
      targetUserIds,
      targetDepartmentIds,
      targetTags,
      agentId,
      EnumAppMessageType.Text,
      safe
    );
    this.textcard = { title, description, url, btntxt: btnText };
  }
}
