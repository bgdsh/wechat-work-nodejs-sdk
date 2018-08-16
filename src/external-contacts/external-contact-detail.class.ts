import { ExternalUser } from ".";
import { FollowUser } from "./follow-user.class";

export class ExternalContactDetail {
  // tslint:disable-next-line:variable-name
  public external_contact!: ExternalUser;
  // tslint:disable-next-line:variable-name
  public follow_user!: FollowUser[];

  public get externalUserInfo() {
    return this.external_contact;
  }
  public set externalUserInfo(contact: ExternalUser) {
    this.external_contact = contact;
  }

  public get usersFollowThisExternalUser() {
    return this.follow_user;
  }
  public set usersFollowThisExternalUser(users: FollowUser[]) {
    this.follow_user = users;
  }
}
