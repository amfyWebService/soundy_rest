import BaseController from './BaseController';
import { JsonController, Get, Param, CurrentUser, Post, Body } from 'routing-controllers';
import MqService from '@/core/MqService';
import { IsString, MinLength } from 'class-validator';

export class createPlaylistBody {
    @IsString()
    name: string;
}

export class addTrackToPlaylistBody {
    @IsString()
    @MinLength(10)
    trackID: string;

    @IsString()
    @MinLength(10)
    playlistID: string;
}

@JsonController("/playlist")
export class PlaylistController extends BaseController {

    @Get("/:id")
    async getPlaylistByID(@Param("id") id: string, @CurrentUser() user: any) {
        const res = await MqService.query("getPlaylistByID", { playlistID: id }, user);

        return this.handleResponse(res, {
        });
    }

    @Get("/user/:id")
    async getPlaylistsByUserID(@Param("id") id: string, @CurrentUser() user: any) {
        const res = await MqService.query("getPlaylistsByUserID", { userID: id }, user);

        return this.handleResponse(res, {
        });
    }

    @Post()
    async createPlaylist(@Body({ required: true, validate: true }) body : createPlaylistBody) {
        const res = await MqService.query("createPlaylist", body);

        return this.handleResponse(res, {
        });
    }

    @Post("/track")
    async addTrackToPlaylist(@Body({ required: true, validate: true }) body : addTrackToPlaylistBody) {
        const res = await MqService.query("addTrackToPlaylist", body);

        return this.handleResponse(res, {
            "music_already_in_playlist" : 400
        });
    }
}
