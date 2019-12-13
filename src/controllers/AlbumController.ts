import BaseController from './BaseController';
import { JsonController, Get, Param } from 'routing-controllers';
import MqService from '@/core/MqService';

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

}
