import * as http from "node:http";
import app from "@/libs/server/http-server";
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import typeDefs from "@/graph/types";
import { invoiceQueryResolver } from "@/graph/resolver/invoice";
import { UserMutationResolver } from "@/graph/resolver/user";

interface MyContext {
  token?: string;
}

const httpServer = http.createServer(app);

const apolloServer = new ApolloServer<MyContext>({
  typeDefs,
  resolvers: {
    Query: {
      sayHello: () => "Hello World",
      ...invoiceQueryResolver,
    },
    Mutation: {
      sampleMutation: (_: Record<string, any>, { num }: { num: number }) =>
        num + 1,
      ...UserMutationResolver,
    },
  },
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

(async () => {
  await apolloServer.start();
  //TEMPORARY FIX, please ignore this abomination
  (app as any).use(
    "/graphql",
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(apolloServer),
  );
})();

export { httpServer };
