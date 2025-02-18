// Import the 'express' module
import { httpServer } from "@/libs/server/graph-server";
import config from "@/config";

httpServer.listen({ port: config.server.port, host: config.server.host });
console.log(`Server is running on http://localhost:${config.server.port}`);
