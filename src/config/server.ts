import dotenv from "dotenv";

dotenv.config();

export interface ServerConfig {
  port: string;
  host: string;
}

const serverConfig: ServerConfig = {
  port: "3001",
  host: "localhost",
};

export default serverConfig;
