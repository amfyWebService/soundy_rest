import { Application } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import "reflect-metadata";
import config from './config';
import multer from 'multer';
import { createExpressServer } from 'routing-controllers';

class App {
  public app: Application;
  public upload: multer.Instance

  constructor() {
    this.app = createExpressServer({
      cors: true,
      development: !config.isProd,
      middlewares: [
        //Allows us to receive requests with data in json format
        bodyParser.json({ limit: '50mb' }),
        //Allows us to receive requests with data in x-www-form-urlencoded format
        bodyParser.urlencoded({ limit: '50mb', extended: true })
      ],
      routePrefix: "/api",
      controllers: [__dirname + "/controllers/*.ts"],
    });
    this.upload = multer();

    this.app.listen(config.port);

    console.log("Server listening on port: " + config.port);
  }
}

export default new App().app;