// config.ts
const dotenv = require('dotenv-defaults');
dotenv.config();

export default {
    env: process.env.NODE_ENV,
    isDev: process.env.NODE_ENV === "development",
    isProd: process.env.NODE_ENV === "production",
    endpoint: process.env.API_URL,
    port: process.env.PORT,
    AMQP_HOST: process.env.AMQP_HOST,
}