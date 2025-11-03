import Fastify from "fastify";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";
import { env } from "./env.js";
import authRoutes from "./routes/auth.js"; // ⬅️ adicione isto

const app = Fastify({ logger: true });

await app.register(cors, {
  origin: [env.FRONT_ORIGINS],
  credentials: true,
});

await app.register(cookie, {
  secret: env.SESSION_SECRET,
  hook: "onRequest",
});

app.register(authRoutes, { prefix: "/auth" }); // ⬅️ registre com prefixo

app.get("/health", async () => ({ status: "ok" }));

app
  .listen({ port: env.PORT, host: "0.0.0.0" })
  .then(() => app.log.info(`API on http://localhost:${env.PORT}`))
  .catch((err) => {
    app.log.error(err);
    process.exit(1);
  });
