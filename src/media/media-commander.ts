import { createWriteStream, unlinkSync } from "fs";
import { get } from "https";
import { AccessToken, CommanderParent } from "../core";
import { doPost } from "../core/http-helper";

export type MediaType = "image" | "voice" | "video" | "file";

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

  public async uploadTemp(stream: ReadableStream, fileType: MediaType, filename: string) {
    await this.accessToken.ensureNotExpired();
    const formData = new FormData();
    formData.append("file", stream as any);
    formData.append("filename", filename);
    const res: {
      type: MediaType,
      media_id: string,
      created_at: string,
    } = await doPost(
      `https://qyapi.weixin.qq.com/cgi-bin/media/upload?access_token=${this.accessToken.accessToken}&type=${fileType}`,
      formData,
      { "Content-Type": "multipart/form-data" }
    );
    return {
      createdAt: new Date(parseInt(res.created_at, 10) * 1000),
      mediaId: res.media_id,
      type: res.type,
    };
  }

  public async uploadImage(stream: ReadableStream, filename: string) {
    await this.accessToken.ensureNotExpired();
    const formData = new FormData();
    formData.append("file", stream as any);
    formData.append("filename", filename);
    const res: {
      url: string,
    } = await doPost(
      `https://qyapi.weixin.qq.com/cgi-bin/media/uploadimg?access_token=${this.accessToken.accessToken}`,
      formData,
      { "Content-Type": "multipart/form-data" }
    );
    return res;
  }
}
