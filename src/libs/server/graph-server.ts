import * as http from "node:http";
import app from "@/libs/server/http-server";
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import typeDefs from "@/graph/types";
import { TenantedModel } from "@/tenanted/model";
import { Tenant } from "@/non-tenanted/model/tenant";
import resolvers from "../../graph/resolvers";
import { TenantConnectionCaching } from "@/libs/cache/tenant-connection-caching";

export interface GraphContext {
  tenantId?: string;
  compiledModel?: TenantedModel;
}

const httpServer = http.createServer(app);

const apolloServer = new ApolloServer<GraphContext>({
  typeDefs,
  resolvers: resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  introspection: true,
});

(async () => {
  await apolloServer.start();
  //TEMPORARY FIX, please ignore this abomination
  (app as any).use(
    "/graphql",
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(apolloServer, {
      context: async ({ req }): Promise<GraphContext> => {
        const tenantId = req.header("x-tenant-id");
        if (typeof tenantId === "string") {
          const tenant = await Tenant.findByPk(tenantId);
          if (tenant) {
            return {
              tenantId: tenant.id,
              compiledModel: await TenantConnectionCaching.getConnection(
                tenant.uuid,
              ),
            };
          }
        }
        return {};
      },
    }),
  );
})();

export { httpServer, app };
