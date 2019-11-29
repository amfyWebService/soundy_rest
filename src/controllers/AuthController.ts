import { JsonController, Post, BodyParam, Body } from "routing-controllers";
import MqService from "@/core/MqService";
import { IsEmail, IsString, MinLength, IsDate, IsDateString } from 'class-validator';
import BaseController from './BaseController';

export class LoginBody {
    @IsEmail()
    username: string;

    @IsString()
    @MinLength(10)
    password: string;
}

export class RegisterBody {
    @IsEmail()
    mail: string;

    @IsString()
    @MinLength(10)
    password: string;

    @IsDateString()
    birthday: Date;

    @IsString()
    firstname: string;

    @IsString()
    lastname: string;
}

@JsonController("/")
export class AuthController extends BaseController {

    @Post("register")
    async register(
        @Body({ required: true, validate: true }) body: RegisterBody,
    ) {
        const res = await MqService.query("register", body);

        return this.handleResponse(res, {
            "user_already_exist": 400,
            "entity_validation_error": 400
        });
    }

    @Post("login")
    async login(
        @Body({ required: true, validate: true }) body: LoginBody,
    ) {
        const res = await MqService.query("login", body);

        return this.handleResponse(res, {
            "bad_username_password": 400,
        });
    }
}