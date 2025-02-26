import dotenv from "dotenv";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import NodeCache from "node-cache";

dotenv.config();

const configCache = new NodeCache();
const client = new SecretManagerServiceClient();

interface AuthConfig {
  clerkSecretKey: string;
}

interface ServerConfig {
  port: string;
  host: string;
}

interface DBConfig {
  dbHost: string;
  mainDBName: string;
  mainDBUser: string;
  mainDBPassword: string;
  dbOption: string;
  neonAPIKey: string;
  neonProjectId: string;
  neonBranchId: string;
  mongoHost: string;
}

interface Config {
  db: DBConfig;
  server: ServerConfig;
  auth: AuthConfig;
}

const authConfig: AuthConfig = {
  clerkSecretKey: process.env["CLERK_SECRET_KEY"] || "",
};

const dbConfig: DBConfig = {
  dbHost: process.env["MAIN_POSTGRES_URL"] || "",
  mainDBName: process.env["MAIN_POSTGRES_DBNAME"] || "",
  mainDBUser: process.env["MAIN_POSTGRES_USER"] || "",
  mainDBPassword: process.env["MAIN_POSTGRES_PASSWORD"] || "",
  dbOption: process.env["DB_OPTION"] || "",
  neonAPIKey: process.env["NEON_API_KEY"] || "",
  neonProjectId: process.env["NEON_PROJECT_ID"] || "",
  neonBranchId: process.env["NEON_BRANCH_ID"] || "",
  mongoHost: process.env["MONGO_URL"] || "",
};

const serverConfig: ServerConfig = {
  port: process.env["SERVER_PORT"] || "3001",
  host: process.env["SERVER_HOST"] || "localhost",
};

const config: Config = {
  db: dbConfig,
  server: serverConfig,
  auth: authConfig,
};

async function loadSecret() {
  if (process.env["USE_SECRET_MANAGER"] !== "true") {
    return;
  }
  try {
    const secretNames = [
      "MAIN_POSTGRES_URL",
      "MAIN_POSTGRES_DBNAME",
      "MAIN_POSTGRES_USER",
      "MAIN_POSTGRES_PASSWORD",
      "NEON_API_KEY",
      "NEON_PROJECT_ID",
      "NEON_BRANCH_ID",
      "MONGO_URL",
      "CLERK_SECRET_KEY",
    ];

    const projectId = process.env["GOOGLE_PROJECT_ID"];

    if (!projectId) {
      throw new Error("GOOGLE_PROJECT_ID is not set in environment variables.");
    }

    for (const secretName of secretNames) {
      const [version] = await client.accessSecretVersion({
        name: `projects/${projectId}/secrets/${secretName}/versions/latest`,
      });

      const secretValue = version?.payload?.data?.toString();

      if (secretValue) {
        configCache.set(secretName, secretValue);
      }
    }

    // Override the config values with secrets if available
    dbConfig.dbHost = configCache.get("MAIN_POSTGRES_URL") || dbConfig.dbHost;
    dbConfig.mainDBName =
      configCache.get("MAIN_POSTGRES_DBNAME") || dbConfig.mainDBName;
    dbConfig.mainDBUser =
      configCache.get("MAIN_POSTGRES_USER") || dbConfig.mainDBUser;
    dbConfig.mainDBPassword =
      configCache.get("MAIN_POSTGRES_PASSWORD") || dbConfig.mainDBPassword;
    dbConfig.neonAPIKey =
      configCache.get("NEON_API_KEY") || dbConfig.neonAPIKey;
    dbConfig.neonProjectId =
      configCache.get("NEON_PROJECT_ID") || dbConfig.neonProjectId;
    dbConfig.neonBranchId =
      configCache.get("NEON_BRANCH_ID") || dbConfig.neonBranchId;
    dbConfig.mongoHost = configCache.get("MONGO_URL") || dbConfig.mongoHost;

    authConfig.clerkSecretKey =
      configCache.get("CLERK_SECRET_KEY") || authConfig.clerkSecretKey;

    console.log("Secrets loaded successfully.");
  } catch (error) {
    console.error("Error loading secrets:", error);
  }
}

export { loadSecret };
export default config;
