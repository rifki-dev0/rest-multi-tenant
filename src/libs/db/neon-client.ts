import { createApiClient } from "@neondatabase/api-client";
import config from "@/config";

const neonClient = createApiClient({
  apiKey: config.db.neonAPIKey,
});

export default neonClient;
