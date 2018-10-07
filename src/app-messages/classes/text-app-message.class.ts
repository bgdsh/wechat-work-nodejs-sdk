import { EnumAppMessageType } from "../enums/app-message-type.enum";
import { EnumSafe } from "../enums/safe.enum";
import { AppMessageBase } from "./app-message-base.class";

export class TextAppMessage extends AppMessageBase {
  public text: { content: string };
  constructor(
    content: string,
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
    this.text = { content };
  }
}
