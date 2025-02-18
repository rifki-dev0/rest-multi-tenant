// Import the 'express' module
import { app, httpServer } from "@/libs/server/graph-server";
import config from "@/config";

httpServer.listen({ port: config.server.port });
console.log(`Server is running on http://localhost:${config.server.port}`);
export default app;
