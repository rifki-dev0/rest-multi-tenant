import dotenv from "dotenv";

dotenv.config();

export interface ServerConfig {
  port: string;
  host: string;
}

const serverConfig: ServerConfig = {
  port: process.env["SERVER_PORT"] || "3001",
  host: process.env["SERVER_HOST"] || "localhost",
};

export default serverConfig;
