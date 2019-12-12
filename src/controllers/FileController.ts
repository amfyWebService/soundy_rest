import { JsonController, Post, UploadedFiles, BadRequestError, InternalServerError, Authorized, CurrentUser } from "routing-controllers"
import config from '../config'
import filesystem from 'fs'
import uuid from "uuid"
import path from "path";
import urljoin from "url-join";
import { QueueResponse } from '@/core/MqService'

@JsonController("/")
export class FileController {
    private dirMusic: string = urljoin(config.HOME_UPLOAD_DIR, "musics");
    private dirCover: string = urljoin(config.HOME_UPLOAD_DIR, "covers");

    @Post("upload")
    async upload(@UploadedFiles('file') files: Array<Express.Multer.File>, @CurrentUser() user: any) {
        if (!files) {
            throw new BadRequestError('No file were uploaded')
        }

        let filePath = "";
        for (let file of files ){
            if (file.mimetype == "audio/mpeg") {
                filePath = urljoin(this.dirMusic, user.id, uuid.v4() + ".mp3");
            } else if(file.mimetype == "image/jpeg"){
                filePath = urljoin(this.dirCover, user.id, uuid.v4() + ".jpg");
            } else {
                throw new BadRequestError('File type not supported')
            }

            try {
                await this.registerFile(filePath, file);
            } catch (e) {
                throw new InternalServerError('An error occurred while register the file')
            }
        }
        return {filePath: filePath}
    }

    private registerFile(filePath: string, file: Express.Multer.File) {
        return new Promise((resolve, reject) => {
            filesystem.mkdir(path.dirname(filePath), { recursive: true }, (err) => {
                if (err){
                    //logger.error(`Error creating directory: ${err}`);
                    reject(err);
                } else {
                    filesystem.writeFileSync(filePath, Buffer.from(new Uint8Array(file.buffer)));
                    resolve();
                }
            });
        });
    }
}
