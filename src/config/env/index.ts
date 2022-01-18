export const config = require("dotenv").config();

export const isProduction = process.env.NODE_ENV === "production";

export const appEnv = {
  httpPort: process.env.PORT || 80,
  prefix: process.env.PREFIX || "",
};

export const jwtEnv = {
  secret: process.env.JWT_SECRET,  
  issuer: process.env.JWT_ISSUER,
  audience: process.env.JWT_AUDIENCE,
  expiresIn: process.env.JWT_EXPIRESIN,
}

export const dbEnv = {
  host: process.env.DATABASE_HOST || "localhost",
  port: parseInt(process.env.DATABASE_PORT || "5432"),
  username: process.env.DATABASE_USER || "user",
  password: process.env.DATABASE_PASS || "password",
  database: process.env.DATABASE_NAME || "database"
}

export const rmqEnv = {
  host: process.env.RABBITMQ_HOST || "",
  user: process.env.RABBITMQ_USER || "",
  password: process.env.RABBITMQ_PASSWORD || "",
  queue: process.env.RABBITMQ_QUEUE_NAME
}