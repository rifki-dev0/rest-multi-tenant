// Import the 'express' module
import { httpServer } from "@/libs/server/graph-server";
import config from "@/config";

httpServer.listen({ port: config.server.port });
console.log(`Server is running on http://localhost:${config.server.port}`);
export default (req: any, res: any) => {
  httpServer.emit("request", req, res);
};
