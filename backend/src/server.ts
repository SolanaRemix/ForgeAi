import http from "http";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { env } from "./config/env";
import { createSocketServer } from "./lib/websocket";
import { errorHandler } from "./middleware/error-handler";
import { healthRouter } from "./routes/health";
import { projectsRouter } from "./routes/projects";
import { pricingRouter } from "./routes/pricing";
import { authRouter } from "./routes/auth";
import { integrationsRouter } from "./routes/integrations";
import { governanceRouter } from "./routes/governance";

const app = express();

const metrics = {
  activeConnections: 0,
  requestsServed: 0,
  startedAt: new Date().toISOString()
};

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ strict: true, limit: "100kb" }));

app.use((req, _res, next) => {
  metrics.requestsServed += 1;
  next();
});

app.use("/api", healthRouter);
app.use("/api", projectsRouter);
app.use("/api", pricingRouter);
app.use("/api", authRouter);
app.use("/api", integrationsRouter);
app.use("/api", governanceRouter);

app.use(errorHandler);

const server = http.createServer(app);
const socketServer = createSocketServer(server, () => ({ ...metrics }));

socketServer.on("connection", (socket) => {
  metrics.activeConnections = socketServer.clients.size;

  socket.on("close", () => {
    metrics.activeConnections = socketServer.clients.size;
  });
});
socketServer.on("close", () => {
  metrics.activeConnections = socketServer.clients.size;
});

server.listen(env.PORT, () => {
  // intentional minimal startup log
  process.stdout.write(`forgeai-backend listening on :${env.PORT}\n`);
});
