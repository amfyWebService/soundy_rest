import { JsonController, Post, Body, CurrentUser, Get, Params, Param, Patch, Put } from "routing-controllers";
import BaseController from './BaseController';
import { IsString } from 'class-validator';
import MqService from '@/core/MqService';

export class addTrackBody{    
    @IsString()
    title: string;
}

@JsonController("/tracks")
export class TrackController extends BaseController {

    @Put("/:id")
    async updateTrack(
        @CurrentUser() user: any,
        @Param("id") id: string,
        @Body({ required: true, validate: true }) body : addTrackBody,
    ) {
        const res = await MqService.query("updateTrack", {id: id, ...body}, user);

        return this.handleResponse(res, {
        });
    }



    @Get("/:id")
    async getTrack(
        @CurrentUser() user: any,
        @Param("id") id: string
    ) {
        const res = await MqService.query("getTrack", {trackID: id}, user);

        return this.handleResponse(res, {
        });
    }
}