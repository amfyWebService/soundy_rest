import MqService from '@/core/MqService';
import { logger } from '@/shared';
import { Logger } from 'winston';

export default class BaseController {
    protected logger: Logger = logger;

    protected mqQuery<T>(queueName: string, data: any): Promise<T> {
        return MqService.query(queueName, data);
    }
}