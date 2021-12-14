export const config = require("dotenv").config();

export const isProduction = process.env.NODE_ENV === "production";

export const databaseConfig = {
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || "5432"),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASS,
  database: process.env.DATABASE_NAME
};