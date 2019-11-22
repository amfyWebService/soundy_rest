import { JsonController, Get, Req, Controller, Body, Post } from "routing-controllers";
import { Request } from "express"

@JsonController("/")
export class DefaultController {

    @Get("ping")
    ping(@Req() req: Request) {
        return req.connection.remoteAddress;
    }

    @Post("check")
    check(@Body() body: any) {
        return body;
    }
}