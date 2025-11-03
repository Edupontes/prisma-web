/* eslint-env node */
import "dotenv/config";

export const env = {
  PORT: Number(process.env.PORT ?? 4000),
  SESSION_SECRET: process.env.SESSION_SECRET,
  FRONT_ORIGIN: "http://localhost:5173",
};
