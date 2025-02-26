import config, { loadSecret } from "@/config";

async function startServer() {
  await loadSecret();
  const { httpServer } = await import("./libs/server/graph-server");
  httpServer.listen({ port: config.server.port });
  console.log(
    `Server is running on http://${config.server.host}:${config.server.port}`,
  );
}

startServer();
