import { config } from "dotenv";

config({ path: "./.env", quiet: true });

export const {
  PORT,
  NODE_ENV,
  APP_NAME,
  DB_URI,
  SALT_ROUNDS,
  ENCRYPTION_KEY,
  APP_EMAIL,
  APP_EMAIL_PASSWORD,
} = process.env;
