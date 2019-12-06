import 'module-alias/register';
import "reflect-metadata";
import { Application } from 'express';
import bodyParser from 'body-parser';
import { createExpressServer, Action, UnauthorizedError } from 'routing-controllers';
import multer from 'multer';
import config from './config';
import MqService, { QueueResponse } from '@/core/MqService';
import { logger } from '@/shared';
import mLogger from 'morgan';
import { CustomErrorHandler } from './core/middleware/CustomErrorHandler';


export class App {
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
      // authorizationChecker: async (action: Action) => await !!this.getUserFromRequest(action, "auth"),
      currentUserChecker: async (action: Action) => {
        // check if token is in headers
        if (!action.request.headers["authorization"]) return false;

        // get token and call service to verify token
        const token = action.request.headers["authorization"];
        const res: QueueResponse = await MqService.query("authenticate", { token: token });
        
        // handle response
        if (res.error) throw new UnauthorizedError();

        action.request.soundy_user = res;

        return res;
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

  async getUserFromRequest(action: Action, toto: string) {
    console.log("coucou", toto, new Date().toISOString());
    // if already loaded
    if (action.request.soundy_user) return action.request.soundy_user;

    // check if token is in headers
    if (!action.request.headers["authorization"]) return false;

    // get token and call service to verify token
    const token = action.request.headers["authorization"];
    const res: QueueResponse = await MqService.query("authenticate", { token: token });
    console.log("bye", toto, new Date().toISOString());
    // handle response
    if (res.error) return false;

    action.request.soundy_user = res;

    return res;
  }
}

const app = new App();
app.run();

export default app;