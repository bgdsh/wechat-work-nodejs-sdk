import { createWriteStream, unlinkSync } from "fs";
import { get } from "https";
import { AccessToken, CommanderParent } from "../core";

export class MediaCommander extends CommanderParent {
  constructor(accessToken: AccessToken) {
    super(accessToken);
  }

  public async download(mediaId: string, destPath: string) {
    await this.accessToken.ensureNotExpired();
    const url = `https://qyapi.weixin.qq.com/cgi-bin/media/get?access_token=${
      this.accessToken.accessToken
    }&media_id=${mediaId}`;
    return new Promise((resolve, reject) => {
      const file = createWriteStream(destPath);
      get(url, response => {
        response.pipe(file);
        file.on("finish", () => {
          file.close();
          resolve(file.bytesWritten);
        });
      }).on("error", err => {
        unlinkSync(destPath);
        reject(err);
      });
    });
  }
}
