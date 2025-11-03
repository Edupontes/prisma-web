/* eslint-env node */
import "dotenv/config";

export const env = {
  PORT: Number(process.env.PORT ?? 4000),
  SESSION_SECRET: process.env.SESSION_SECRET,
  FRONT_ORIGINS: ["http://localhost:5173", "http://localhost:5174"],
};
