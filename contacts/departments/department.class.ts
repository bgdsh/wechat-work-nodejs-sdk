export class Department {
  public name: string;
  public parentid?: number;
  public order?: number;
  public id?: number;

  public constructor(
    name: string,
    parentId?: number,
    order?: number,
    id?: number
  ) {
    this.name = name;
    this.parentid = parentId;
    this.order = order;
    this.id = id;
  }

  public get parentId() {
    return this.parentid || 0;
  }

  public set parentId(parentId: number) {
    this.parentid = parentId;
  }
}
