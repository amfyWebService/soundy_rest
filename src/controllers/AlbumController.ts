import BaseController from './BaseController';
import { JsonController, Get, Param, Post, Body } from 'routing-controllers';
import MqService from '@/core/MqService';
import { IsString, MinLength } from 'class-validator';

export class createAlbumBody {
    @IsString()
    name: string;
}

export class addTrackToAlbumBody {
    @IsString()
    @MinLength(10)
    trackID: string;

    @IsString()
    @MinLength(10)
    albumID: string;
}

@JsonController("/album")
export class AlbumController extends BaseController {

    @Get("/:id")
    async getAlbumByID(@Param("id") id: string) {
        const res = await MqService.query("getAlbumByID", { albumID: id });

        return this.handleResponse(res, {
        });
    }

    @Get("/user/:id")
    async getAlbumsByUserID(@Param("id") id: string) {
        const res = await MqService.query("getAlbumsByUserID", { userID: id });

        return this.handleResponse(res, {
        });
    }

    @Post()
    async createAlbum(@Body({ required: true, validate: true }) body : createAlbumBody) {
        const res = await MqService.query("createAlbum", body);

        return this.handleResponse(res, {
        });
    }

    @Post("/track")
    async addTrackToAlbum(@Body({ required: true, validate: true }) body : addTrackToAlbumBody) {
        const res = await MqService.query("addTrackToAlbum", body);

        return this.handleResponse(res, {
            "music_already_in_album" : 400
        });
    }

}
