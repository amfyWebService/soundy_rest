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
                "Invalid ID supplied": 400,
                "Album not found": 404
            });
        }
    }

    @Get("album/user/:id")
    async getAlbumsFromUserByID(@Param("id") id: string) {
        if (id != null && id != "") {
            const res = await MqService.query("getAlbumsByUserID", {userID: id});

            return this.handleResponse(res, {
                "Invalid ID supplied": 400,
                "User not found": 404
            });
        }
    }

}
