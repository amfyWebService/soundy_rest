import { JsonController, Post, UploadedFiles, BadRequestError, InternalServerError, Authorized, CurrentUser } from "routing-controllers"
import config from '../config'
import filesystem from 'fs'
import uuid from "uuid"
import path from "path";
import urljoin from "url-join";
import MqService, { QueueResponse } from '@/core/MqService';

@JsonController("/")
export class FileController {
    private static DIR_MUSIC: string = urljoin(config.HOME_UPLOAD_DIR, "musics");
    private static DIR_COVER: string = urljoin(config.HOME_UPLOAD_DIR, "covers");

    @Post("upload")
    async upload(@UploadedFiles('file', {required: true, options: {}}) files: Array<Express.Multer.File>, @CurrentUser() user: any) {
        if (!files) {
            throw new BadRequestError('No file was uploaded')
        }

        let filePath = "";
        let promises: Promise<QueueResponse>[] = [];
        for (let file of files ){
            if (file.mimetype == "audio/mpeg") {
                filePath = urljoin(FileController.DIR_MUSIC, user._id, uuid.v4() + ".mp3");
            } else if(file.mimetype == "image/jpeg"){
                filePath = urljoin(FileController.DIR_COVER, user._id, uuid.v4() + ".jpg");
            } else {
                throw new BadRequestError('File type not supported')
            }

            try {
                await this.registerFile(filePath, file);

                if (file.mimetype == "audio/mpeg") {
                    promises.push(MqService.query("createTrack", {link: path.basename(filePath), user}));
                }
            } catch (e) {
                throw new InternalServerError('An error occurred while registering the file')
            }
        }

        return Promise.all(promises);
    }

    private registerFile(filePath: string, file: Express.Multer.File) {
        return new Promise((resolve, reject) => {
            filesystem.mkdir(path.dirname(filePath), { recursive: true }, (err) => {
                if (err){
                    reject(err);
                } else {
                    filesystem.writeFileSync(filePath, Buffer.from(new Uint8Array(file.buffer)));
                    resolve();
                }
            });
        });
    }
}
