import dotenv from "dotenv";

dotenv.config();

export interface DBConfig {
  dbHost: string;
  mainDBName: string;
  mainDBUser: string;
  mainDBPassword: string;
  dbOption: string;
  neonAPIKey: string;
  neonProjectId: string;
  neonBranchId: string;
}

const dbConfig: DBConfig = {
  dbHost: process.env["MAIN_POSTGRES_URL"] || "",
  mainDBName: process.env["MAIN_POSTGRES_DBNAME"] || "",
  mainDBUser: process.env["MAIN_POSTGRES_USER"] || "",
  mainDBPassword: process.env["MAIN_POSTGRES_PASSWORD"] || "",
  dbOption: process.env["DB_OPTION"] || "",
  neonAPIKey: process.env["NEON_API_KEY"] || "",
  neonProjectId: process.env["NEON_PROJECT_ID"] || "",
  neonBranchId: process.env["NEON_BRANCH_ID"] || "",
};

export default dbConfig;
