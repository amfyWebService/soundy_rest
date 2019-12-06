import { JsonController, Post, UploadedFiles, UseBefore, BadRequestError, InternalServerError, Authorized, CurrentUser } from "routing-controllers"
import { Response } from 'express'
import config from '../config'
import filesystem from 'fs'
import uuid from "uuid"
import path from "path";
import urljoin from "url-join";
import { QueueResponse } from '@/core/MqService'

@JsonController("/")
@Authorized()
export class FileController {
    private dirMusic: string = urljoin(config.HOME_UPLOAD_DIR, "musics");
    private dirCover: string = urljoin(config.HOME_UPLOAD_DIR, "covers");

    @Post("upload")
    async upload(@UploadedFiles('file') files: Array<Express.Multer.File>, @CurrentUser() queueResponse: QueueResponse) {
        if (!files) {
            throw new BadRequestError('No file were uploaded')
        }
        if(queueResponse.error) throw new InternalServerError(queueResponse.error.message)

        if(!queueResponse.user) throw new InternalServerError("An error occurred")

        for (let file of files ){
            let filePath = "";

            if (file.mimetype == "audio/mpeg") {
                filePath = urljoin(this.dirMusic, queueResponse.user.id, uuid.v4() + ".mp3");
            } else if(file.mimetype == "image/jpeg"){
                filePath = urljoin(this.dirCover, queueResponse.user.id, uuid.v4() + ".jpg");
            } else {
                throw new BadRequestError('File type not supported')
            }

            try {
                await this.registerFile(filePath, file);
            } catch (e) {
                throw new InternalServerError('An error occurred while register the file')
            }
        }
        return 'uploaded'
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
