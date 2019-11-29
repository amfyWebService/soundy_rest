// config.ts
export default {
    env: process.env.NODE_ENV || "development",
    isDev: process.env.NODE_ENV === "development",
    isProd: process.env.NODE_ENV === "production",
    port: process.env.PORT || 8080,
    AMQP_URL: process.env.AMQP_URL || "",
}