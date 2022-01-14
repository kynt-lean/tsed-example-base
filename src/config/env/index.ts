export const config = require("dotenv").config();

export const isProduction = process.env.NODE_ENV === "production";

export const appEnv = {
  httpPort: process.env.PORT || 80
};

export const rmqEnv = {
  host: process.env.RABBITMQ_HOST || "",
  user: process.env.RABBITMQ_USER || "",
  password: process.env.RABBITMQ_PASSWORD || "",
  queue: process.env.RABBITMQ_QUEUE_NAME
}