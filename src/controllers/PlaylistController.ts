import BaseController from './BaseController';
import { JsonController, Get, Param, CurrentUser, Post, Body, Put } from 'routing-controllers';
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
}

@JsonController("/playlists")
export class PlaylistController extends BaseController {

    @Get("/:id")
    async getPlaylistByID(@Param("id") id: string, @CurrentUser() user: any) {
        const res = await MqService.query("getPlaylistByID", { playlistID: id }, user);

        return this.handleResponse(res, {
        });
    }

    @Get("/user/:id")
    async getPlaylistsByUserID(@Param("id") id: string, @CurrentUser() user: any) {
        let userID = id === "me" ? user._id : id;

        const res = await MqService.query("getPlaylistsByUserID", { userID: userID }, user);

        return this.handleResponse(res, {
        });
    }

    @Post()
    async createPlaylist(@Body({ required: true, validate: true }) body: createPlaylistBody, @CurrentUser() user: any) {

        const res = await MqService.query("createPlaylist", { name: body.name, user: user });

        return this.handleResponse(res, {
        });
    }

    @Put("/:playlist_id/track")
    async addTrackToPlaylist(@Param("playlist_id") playlistId: string, @Body({ required: true, validate: true }) body: addTrackToPlaylistBody) {
        const res = await MqService.query("addTrackToPlaylist", {trackID: body.trackID, playlistID: playlistId});

        return this.handleResponse(res, {
            "music_already_in_playlist": 400
        });
    }
}
