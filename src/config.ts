// config.ts
const dotenv = require('dotenv-defaults');
const urlJoin = require('url-join');
dotenv.config();
const getUserRootFolder = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;

  export default {
    env: process.env.NODE_ENV,
    isDev: process.env.NODE_ENV === "development",
    isProd: process.env.NODE_ENV === "production",
    endpoint: process.env.API_URL,
    port: process.env.PORT,
    AMQP_HOST: process.env.AMQP_HOST,

    // PATH
    PROJECT_DIR: __dirname,
    HOME_DIR: getUserRootFolder,
    HOME_UPLOAD_DIR: urlJoin(getUserRootFolder, process.env.HOME_UPLOAD_PATH),
}