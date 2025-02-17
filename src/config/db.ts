import dotenv from "dotenv";

dotenv.config();

export interface DBConfig {
  mainDBUrl: string;
  mainDBUser: string;
  mainDBPassword: string;
  neonAPIKey: string;
  neonProjectId: string;
  neonBranchId: string;
}

const dbConfig: DBConfig = {
  mainDBUrl: process.env["MAIN_POSTGRES_URL"] || "",
  mainDBUser: process.env["MAIN_POSTGRES_USER"] || "",
  mainDBPassword: process.env["MAIN_POSTGRES_PASSWORD"] || "",
  neonAPIKey: process.env["NEON_API_KEY"] || "",
  neonProjectId: process.env["NEON_PROJECT_ID"] || "",
  neonBranchId: process.env["NEON_BRANCH_ID"] || "",
};

export default dbConfig;
