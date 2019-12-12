import BaseController from './BaseController';
import { JsonController, Get, Param } from 'routing-controllers';
import MqService from '@/core/MqService';

@JsonController("/")
export class AlbumController extends BaseController {

    @Get("album/:id")
    async getAlbumByID(@Param("id") id: string) {
        if (id != null && id != "") {
            const res = await MqService.query("getAlbumByID", {albumID: id});

            return this.handleResponse(res, {
                "entity_id_not_found" : 400
            });
        }
    }

    @Get("album/user/:id")
    async getAlbumsByUserID(@Param("id") id: string) {
        if (id != null && id != "") {
            const res = await MqService.query("getAlbumsByUserID", {userID: id});

            return this.handleResponse(res, {
                "entity_id_not_found" : 400
            });
        }
    }

}
