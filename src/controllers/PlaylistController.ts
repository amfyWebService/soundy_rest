import BaseController from './BaseController';
import { JsonController, Get, Param } from 'routing-controllers';
import MqService from '@/core/MqService';

@JsonController("/")
export class PlaylistController extends BaseController {

    @Get("playlist/:id")
    async getPlaylistByID(@Param("id") id: string) {
        if (id != null && id != "") {
            const res = await MqService.query("getPlaylistByID", {playlistID: id});

            return this.handleResponse(res, {
                "entity_id_not_found" : 400
            });
        }
    }

    @Get("playlist/user/:id")
    async getPlaylistsByUserID(@Param("id") id: string) {
        if (id != null && id != "") {
            const res = await MqService.query("getPlaylistsByUserID", {userID: id});

            return this.handleResponse(res, {
                "entity_id_not_found" : 400
            });
        }
    }

}
