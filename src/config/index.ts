import dbConfig, { DBConfig } from "@/config/db";

import serverConfig, { ServerConfig } from "@/config/server";
import authConfig, { AuthConfig } from "@/config/auth";

export interface Config {
  db: DBConfig;
  server: ServerConfig;
  auth: AuthConfig;
}

const config: Config = {
  db: dbConfig,
  server: serverConfig,
  auth: authConfig,
};

export default config;
