import dbConfig, { DBConfig } from "@/config/db";

import serverConfig, { ServerConfig } from "@/config/server";

export interface Config {
  db: DBConfig;
  server: ServerConfig;
}

const config: Config = {
  db: dbConfig,
  server: serverConfig,
};

export default config;
