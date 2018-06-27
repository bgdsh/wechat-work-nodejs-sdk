export class CustomizedAppSimple {
  public agentid!: string;
  public name!: string;
  // tslint:disable-next-line:variable-name
  public square_logo_url!: string;

  public constructor(obj: object) {
    Object.assign(this, obj);
  }
}
