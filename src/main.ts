import 'module-alias/register';
import "reflect-metadata";
import { Application } from 'express';
import bodyParser from 'body-parser';
import { createExpressServer, Action } from 'routing-controllers';
import multer from 'multer';
import config from './config';
import MqService, { QueueResponse } from '@/core/MqService';
import { logger } from '@/shared';
import mLogger from 'morgan';
import { CustomErrorHandler } from './core/middleware/CustomErrorHandler';


class App {
  public app: Application;
  public upload: multer.Instance;

  constructor() {
    this.app = createExpressServer({
      cors: true,
      development: !config.isProd,
      middlewares: [
        CustomErrorHandler
      ],
      routePrefix: "/api",
      controllers: [__dirname + "/controllers/*.ts"],
      authorizationChecker: async (action: Action) => {
        // here you can use request/response objects from action
        // also if decorator defines roles it needs to access the action
        // you can use them to provide granular access check
        // checker must return either boolean (true or false)
        // either promise that resolves a boolean value
        if (!action.request.headers["authorization"]) return false

        const token = action.request.headers["authorization"];
        const res: QueueResponse = await MqService.query("authenticate", token);
        if (res.error) return false;

        return true
      },
      currentUserChecker: async (action: Action) => {
        // here you can use request/response objects from action
        // you need to provide a user object that will be injected in controller actions
        // demo code:
        const token = action.request.headers["authorization"];
        return await MqService.query("authenticate", token);
      }
    });
    this.upload = multer();
    MqService.init(config.AMQP_URL);
  }

  setExpressConfig() {
    this.app.use(mLogger('dev'));
    //Allows us to receive requests with data in json format
    this.app.use(bodyParser.json({ limit: '50mb' }));
    //Allows us to receive requests with data in x-www-form-urlencoded format
    this.app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  }

  run() {
    this.app.listen(config.port, () => {
      logger.info('Express server started on port: ' + config.port);
    });
  }
}

const app = new App();
app.run();

export default app;