export class Tag {
  public tagid?: number;
  public tagname: string;

  public constructor(name: string, id?: number) {
    this.tagid = id;
    this.tagname = name;
  }

  public get id() {
    return this.tagid || 0;
  }

  public set id(id: number) {
    this.tagid = id;
  }

  public get name() {
    return this.tagname;
  }

  public set name(name: string) {
    this.tagname = name;
  }
}
