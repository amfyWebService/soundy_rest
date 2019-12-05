// config.ts
const urlJoin = require('url-join');

const getUserRootFolder = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;

export default {
    env: process.env.NODE_ENV || "development",
    isDev: process.env.NODE_ENV === "development",
    isProd: process.env.NODE_ENV === "production",
    port: process.env.PORT || 8080,
    AMQP_URL: process.env.AMQP_URL || "",

    // PATH
    PROJECT_DIR: __dirname,
    HOME_DIR: getUserRootFolder,
    HOME_UPLOAD_DIR: urlJoin(getUserRootFolder, process.env.HOME_UPLOAD_PATH),
}