import { QueueResponse } from '@/core/MqService';
import { logger } from '@/shared';
import { Logger } from 'winston';
import { InternalServerError, HttpError } from 'routing-controllers';

export default class BaseController {
    protected logger: Logger = logger;

    // protected mqQuery<T extends QueueResponse>(queueName: string, data: any): Promise<T> {
    //     return MqService.query(queueName, data);
    // }

    protected handleResponse(res: QueueResponse, mapErrorCodeToHttpCode: {[key: string]: number}): QueueResponse{
        if(res.error){
            const httpCode = mapErrorCodeToHttpCode[res.error.code];
            let error: HttpError;
            if(httpCode){
                error = new HttpError(httpCode, res.error.message);
                error.name = res.error.code;
            } else {
                error = new InternalServerError("Unexpected error");
            }
            
            throw error;
        } else {
            return res;
        }
    }
}