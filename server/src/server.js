import Fastify from "fastify";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";
import { env } from "./env.js";
import authRoutes from "./routes/auth.js"; // ⬅️ adicione isto
import cadastrosRoutes from "./routes/cadastros.js";

const app = Fastify({ logger: true });

await app.register(cors, {
  origin: [env.FRONT_ORIGINS],
  credentials: true,
});

await app.register(cookie, {
  secret: env.SESSION_SECRET,
  hook: "onRequest",
});

await app.register(cadastrosRoutes, { prefix: "/cadastros" });

app.register(authRoutes, { prefix: "/auth" }); // ⬅️ registre com prefixo

app.get("/health", async () => ({ status: "ok" }));

app
  .listen({ port: env.PORT, host: "0.0.0.0" })
  .then(() => app.log.info(`API on http://localhost:${env.PORT}`))
  .catch((err) => {
    app.log.error(err);
    // eslint-disable-next-line no-undef
    process.exit(1);
  });
