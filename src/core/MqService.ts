import * as amqp from "amqp-ts";
import { logger } from '@/shared';
import { InternalServerError } from 'routing-controllers';

export default class MqService {
    private static connection: amqp.Connection;
    private static defaultExchange: amqp.Exchange;

    static init(url: string) {
        logger.info("AMQP started on url: " + url);
        this.connection = new amqp.Connection(url);
        this.defaultExchange = this.connection.declareExchange('soundy_exchange');
    }

    static async query<T extends QueueResponse>(queueName: string, data: any): Promise<QueueResponse|T> {
        if (!this.connection) throw Error("Service not initialized");
        const queue = this.connection.declareQueue(queueName, { durable: true });
        queue.bind(this.defaultExchange);

        const res: amqp.Message = await queue.rpc(JSON.stringify(data));
        queue.unbind(this.defaultExchange);
        
        try {
            return JSON.parse(res.getContent().toString());
        } catch(e){
            logger.error("parse queue response : " + e);
            throw new InternalServerError('Service error'); 
        }
    }
}

export interface QueueResponse {
    error?: {
        code: string,
        message: string
    }
}