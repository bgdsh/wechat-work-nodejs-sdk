class CObj {
  public field1!: string;
  public field2!: string;

  public get Field() {
    return this.field1 + this.field2;
  }
}
test("Test suite should work fine", () => {
  expect(2 > 1);
  const cObj = { field1: "field1", field2: "field2" } as CObj;
  expect(cObj.Field === "field1field2");
});
