// config.ts
const dotenv = require('dotenv-defaults');
dotenv.config();
const getUserRootFolder =  () => {
    return process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
  }
export default {
    env: process.env.NODE_ENV,
    isDev: process.env.NODE_ENV === "development",
    isProd: process.env.NODE_ENV === "production",
    endpoint: process.env.API_URL,
    port: process.env.PORT,
    AMQP_HOST: process.env.AMQP_HOST,
    HOME_UPLOAD_PATH: process.env.HOME_UPLOAD_PATH,
    HOME_DIR: getUserRootFolder()
}