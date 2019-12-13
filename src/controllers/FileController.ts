import { JsonController, Post, UploadedFiles, BadRequestError, InternalServerError, Authorized, CurrentUser, UploadedFile } from "routing-controllers"
import config from '../config'
import filesystem from 'fs'
import uuid from "uuid"
import path from "path";
import MqService, { QueueResponse } from '@/core/MqService';
import { logger } from '@/shared';
import BaseController from './BaseController';

@JsonController("/")
export class FileController extends BaseController {
    private static DIR_MUSIC: string = path.join(config.HOME_UPLOAD_DIR, "musics");
    private static DIR_COVER: string = path.join(config.HOME_UPLOAD_DIR, "covers");

    constructor() {
        super();
        logger.info("Upload directories", { music: FileController.DIR_MUSIC, cover: FileController.DIR_COVER }, null);
    }

    @Post("upload")
    async upload(@UploadedFile('file', { required: true, options: {} }) file: Express.Multer.File, @CurrentUser({ required: true }) user: any) {
        let filePath = "";

        if (file.mimetype == "audio/mpeg") {
            filePath = path.join(FileController.DIR_MUSIC, user._id, uuid.v4() + ".mp3");
        } else if (file.mimetype == "image/jpeg") {
            filePath = path.join(FileController.DIR_COVER, user._id, uuid.v4() + ".jpg");
        } else {
            throw new BadRequestError('File type not supported')
        }

        try {
            await this.registerFile(filePath, file);

            if (file.mimetype == "audio/mpeg") {
                const res = await MqService.query("createTrack", { link: path.basename(filePath) }, user);
                return this.handleResponse(res);
            }
        } catch (e) {
            logger.error(e);
            throw new InternalServerError('An error occurred while registering the file')
        }
    }

    private registerFile(filePath: string, file: Express.Multer.File): Promise<void> {
        return new Promise((resolve, reject) => {
            filesystem.mkdir(path.dirname(filePath), { recursive: true }, (err) => {
                if (err) {
                    reject(err);
                } else {
                    filesystem.writeFileSync(filePath, Buffer.from(new Uint8Array(file.buffer)));
                    resolve();
                }
            });
        });
    }
}
