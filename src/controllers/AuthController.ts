import { JsonController, Post, BodyParam, Body } from "routing-controllers";
import MqService from "@/core/MqService";
import { IsEmail, IsString, MinLength, IsDate, IsDateString } from 'class-validator';
import BaseController from './BaseController';

export class LoginBody {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(10)
    password: string;
}

export class RegisterBody extends LoginBody {
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
        return await MqService.query("register", body);
    }

    @Post("login")
    async login(
        @Body({ required: true, validate: true }) body: LoginBody,
    ) {
        return await MqService.query("login", body);
    }
}