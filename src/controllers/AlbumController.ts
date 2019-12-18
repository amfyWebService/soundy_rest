import BaseController from './BaseController';
import { JsonController, Get, Param, Post, Body, CurrentUser, Put } from 'routing-controllers';
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
}

@JsonController("/albums")
export class AlbumController extends BaseController {

    @Get("/:id")
    async getAlbumByID(@Param("id") id: string) {
        const res = await MqService.query("getAlbumByID", { albumID: id });

        return this.handleResponse(res, {
        });
    }

    @Get("/user/:id")
    async getAlbumsByUserID(@Param("id") id: string, @CurrentUser() user: any) {
        let userID = id === "me" ? user._id : id;
        const res = await MqService.query("getAlbumsByUserID", { userID: userID });

        return this.handleResponse(res, {
        });
    }

    @Post()
    async createAlbum(@Body({ required: true, validate: true }) body : createAlbumBody, @CurrentUser() user: any) {
        const res = await MqService.query("createAlbum", {name: body.name, user: user});

        return this.handleResponse(res, {
        });
    }

    @Put("/:album_id/track")
    async addTrackToAlbum(@Param("album_id") albumId: string, @Body({ required: true, validate: true }) body : addTrackToAlbumBody) {
        const res = await MqService.query("addTrackToAlbum", {trackID: body.trackID, albumID: albumId});

        return this.handleResponse(res, {
            "music_already_in_album" : 400
        });
    }

}
