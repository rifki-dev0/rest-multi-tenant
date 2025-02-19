import dotenv from "dotenv";

dotenv.config();

export interface AuthConfig {
  clerkSecretKey: string;
}

const authConfig: AuthConfig = {
  clerkSecretKey: process.env["CLERK_SECRET_KEY"] || "",
};

export default authConfig;
