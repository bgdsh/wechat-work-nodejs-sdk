import { CustomizedApp } from "../../customized-apps/customized-app.class";

test("getter should works fine", () => {
  const obj = {
    agentid: "1",
    allow_partys: {
      partyid: [1]
    },
    allow_tags: {
      tagid: [1, 2, 3]
    },
    allow_userinfos: {
      user: [
        {
          userid: "id1"
        },
        {
          userid: "id2"
        },
        {
          userid: "id3"
        }
      ]
    },
    close: 0,
    description: "desc",
    errcode: 0,
    errmsg: "ok",
    home_url: "http://www.qq.com",
    isreportenter: 0,
    name: "NAME",
    redirect_domain: "www.qq.com",
    report_location_flag: 0,
    square_logo_url: "xxxxxxxx"
  };
  const app = new CustomizedApp(obj);
  expect(app.allowedUserIds.join("") === "id1id2id3");
});
