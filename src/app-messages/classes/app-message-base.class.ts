import { EnumAppMessageType } from "../enums/app-message-type.enum";
import { EnumSafe } from "../enums/safe.enum";

export class AppMessageBase {
  public touser?: string;
  public toparty?: string;
  public totag?: string;
  public msgtype: EnumAppMessageType;
  public agentid: number;
  public safe: EnumSafe;

  constructor(
    targetUserIds: string[] = [],
    targetDepartmentIds: string[] = [],
    targetTags: string[] = [],
    agentId: number,
    messageType: EnumAppMessageType,
    safe: EnumSafe = 0
  ) {
    this.touser =
      targetUserIds.length > 0 ? targetUserIds.join("|") : undefined;
    this.toparty =
      targetDepartmentIds.length > 0
        ? targetDepartmentIds.join("|")
        : undefined;
    this.totag = targetTags.length > 0 ? targetTags.join("|") : undefined;
    this.agentid = agentId;
    this.safe = safe;
    this.msgtype = messageType;
  }
}
