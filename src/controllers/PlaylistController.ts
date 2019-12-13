import BaseController from './BaseController';
import { JsonController, Get, Param, CurrentUser } from 'routing-controllers';
import MqService from '@/core/MqService';

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

}
