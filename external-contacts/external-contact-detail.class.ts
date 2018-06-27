import { ExternalContact } from "./external-contact.class";
import { FollowMember } from "./follow-member.class";

export class ExternalContactDetail {
  // tslint:disable-next-line:variable-name
  public external_contact!: ExternalContact;
  // tslint:disable-next-line:variable-name
  public follow_user!: FollowMember[];

  public get externalContact() {
    return this.external_contact;
  }
  public set externalContact(contact: ExternalContact) {
    this.external_contact = contact;
  }

  public get membersFollowThisContact() {
    return this.follow_user;
  }
  public set membersFollowThisContact(members: FollowMember[]) {
    this.follow_user = members;
  }
}
