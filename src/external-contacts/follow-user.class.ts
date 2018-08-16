export class FollowUser {
  public userid!: string;
  public remark!: string;
  public description!: string;
  public createtime!: number;

  public get userId() {
    return this.userid;
  }

  public set userId(id: string) {
    this.userid = id;
  }

  public get createTime() {
    return this.createtime;
  }

  public set createTime(time: number) {
    this.createtime = time;
  }
}
