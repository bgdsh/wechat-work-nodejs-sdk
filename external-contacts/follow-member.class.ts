export class FollowMember {
  public userid!: string;
  public remark!: string;
  public description!: string;
  public createtime!: number;

  public get memberId() {
    return this.userid;
  }

  public set memberId(id: string) {
    this.userid = id;
  }

  public get createTime() {
    return this.createtime;
  }

  public set createTime(time: number) {
    this.createtime = time;
  }
}
