import type { Server } from "http";
import { WebSocketServer } from "ws";

export type RuntimeMetrics = {
  activeConnections: number;
  requestsServed: number;
  startedAt: string;
};

export function createSocketServer(server: Server, getMetrics: () => RuntimeMetrics) {
  const wss = new WebSocketServer({ server, path: "/ws" });

  wss.on("connection", (socket) => {
    socket.send(JSON.stringify({ type: "connected", payload: getMetrics() }));
  });

  const timer = setInterval(() => {
    const payload = JSON.stringify({ type: "vitals", payload: getMetrics() });
    for (const client of wss.clients) {
      if (client.readyState === client.OPEN) {
        client.send(payload);
      }
    }
  }, 3000);

  wss.on("close", () => {
    clearInterval(timer);
  });

  return wss;
}
