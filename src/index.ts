import { httpServer } from "@/libs/server/graph-server";
import config from "@/config";

httpServer.listen({ port: config.server.port });
console.log(
  `Server is running on http://${config.server.host}:${config.server.port}`,
);
