import TTLCache from "@isaacs/ttlcache";
import { compileModel, TenantedModel } from "@/tenanted/model";
import { Tenant } from "@/non-tenanted/model/tenant";

export class TenantConnectionCaching {
  static cache: TTLCache<string, TenantedModel> = new TTLCache<
    string,
    TenantedModel
  >({
    dispose: async (value, key) => {
      console.log(`${key} connection is closed`);
      await value._sequelizeConnection.close();
    },
    ttl: 5 * 1000 * 60,
    updateAgeOnGet: true,
    noDisposeOnSet: true,
  });

  constructor() {}

  static async getConnection(tenantUUID: string): Promise<TenantedModel> {
    let connection = TenantConnectionCaching.cache.get(tenantUUID);
    if (!connection) {
      connection = await compileModel(tenantUUID);
      TenantConnectionCaching.cache.set(tenantUUID, connection);
    }
    return connection;
  }

  static async setAllTenant() {
    const tenants = await Tenant.findAll();
    for (const tenant of tenants) {
      if (!TenantConnectionCaching.cache.has(tenant.uuid)) {
        const tenantDB = await compileModel(tenant.uuid);
        TenantConnectionCaching.cache.set(tenant.uuid, tenantDB);
      }
    }
    return TenantConnectionCaching.getAllTenant();
  }

  static getAllTenant(): {
    tenantUUID: string;
    connection: TenantedModel;
  }[] {
    let tenants: { tenantUUID: string; connection: TenantedModel }[] = [];
    for (const [key, val] of TenantConnectionCaching.cache.entries()) {
      tenants.push({ tenantUUID: key, connection: val });
    }
    return tenants;
  }

  static async closeAllConnection() {
    console.log("Close all connection");
    TenantConnectionCaching.cache.clear();
  }
}
