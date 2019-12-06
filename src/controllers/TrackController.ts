import { JsonController, Post, Body } from "routing-controllers";
import BaseController from './BaseController';
import { IsString, IsInt, Min } from 'class-validator';
import MqService from '@/core/MqService';

export class addTrackBody{
    @IsString()
    id: string;
    
    @IsInt()
    @Min(1)
    duration: number;

    @IsString()
    user_id: string;

    @IsString()
    cover_path: string;

    @IsString()
    track_path: string;
}

@JsonController("/")
export class TrackController extends BaseController {

    @Post("tracks")
    async addTrack(
        @Body({ required: true, validate: true }) body : addTrackBody,
    ) {
        const res = await MqService.query("addTrack", body);

        return this.handleResponse(res, {
            "track_already_exists": 400,
            "invalid-input": 405
        })
    }
}