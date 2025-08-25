import {config} from "dotenv";

config({path: "./.env"});

export const {
  PORT,
  NODE_ENV,
  APP_NAME,
  DB_URI
} = process.env
