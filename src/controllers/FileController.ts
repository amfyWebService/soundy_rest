import { JsonController, Post, BadRequestError, InternalServerError, CurrentUser, UploadedFile, Get, Param, Res, NotFoundError } from "routing-controllers"
import config from '../config'
import uuid from "uuid"
import path from "path";
import MqService from '@/core/MqService';
import { logger } from '@/shared';
import BaseController from './BaseController';
import { Response } from 'express';
import * as fs from "fs";

@JsonController("")
export class FileController extends BaseController {
    private static DIR_MUSIC: string = path.join(config.HOME_UPLOAD_DIR, "musics");
    private static DIR_COVER: string = path.join(config.HOME_UPLOAD_DIR, "covers");

    constructor() {
        super();
        logger.info("Upload directories", { music: FileController.DIR_MUSIC, cover: FileController.DIR_COVER }, null);
    }

    @Post("/upload")
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

    @Get("/tracks/:id/stream")
    public async trackStream(@Param("id") id: string, @Res() res: Response){
        const track: any = this.handleResponse(await MqService.query("getTrack", {trackID: id}));

        let filePath = path.join(track.owner, track.link);
        // if(!fs.existsSync(filePath)){
        //     throw new NotFoundError("Track file not found");
        // }
        
        try {
            await new Promise((resolve, reject) => {
                res.sendFile(filePath, {root: FileController.DIR_MUSIC}, (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
        } catch (error) {
            logger.error(error);
        }
        
        return res;
    }

    private registerFile(filePath: string, file: Express.Multer.File): Promise<void> {
        return new Promise((resolve, reject) => {
            fs.mkdir(path.dirname(filePath), { recursive: true }, (err) => {
                if (err) {
                    reject(err);
                } else {
                    fs.writeFileSync(filePath, Buffer.from(new Uint8Array(file.buffer)));
                    resolve();
                }
            });
        });
    }
    
}
