export const config = require("dotenv").config();

export const isProduction = process.env.NODE_ENV === "production";

export const appConfig = {
  httpPort: process.env.PORT || 80
};