import { JsonController, Post, Res, UploadedFiles, UseBefore } from "routing-controllers"
import { Response } from 'express'
import config from '../config'
import filesystem from 'fs'

@JsonController("/")
export class FileController {
    private dirUpload: string = `${config.HOME_DIR}/${config.HOME_UPLOAD_PATH}`
    @Post("upload")
    async upload(@Res() res: Response, @UploadedFiles('file') files: Array<Express.Multer.File>) {
        if (!files) {
            return res.status(400).send('No file were uploaded.');
        }
        files.forEach(file => {
            if (file.mimetype != "audio/mpeg") {
                return res.status(400).send('File type not supported');
            }
            try {
                await this.registerFile(file);
            } catch (e) {
                return res.status(500);
            }
        });
        return res.status(201).send('uploaded');
    }

    private registerFile(file: Express.Multer.File) {
        return new Promise((resolve, reject) => {
            filesystem.mkdir(this.dirUpload, { recursive: true }, (err) => {
                if (err){
                    logger.error(`Error creating directory: ${err}`);
                    reject(err);
                } else {
                    filesystem.writeFileSync(`${this.dirUpload}/${file.originalname}`, Buffer.from(new Uint8Array(file.buffer)));
                    resolve();
                }
            });
        });
    }
}
