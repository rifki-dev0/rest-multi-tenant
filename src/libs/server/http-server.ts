// Create an Express application
import express from "express";
import webhook from "@/rest/webhooks";
import { mainRouter } from "@/rest/routes";

const app = express();

app.use(express.json());
//add sanitation, interceptor etc.

// Define a route for the root path ('/')
app.get("/", (req, res) => {
  // Send a response to the client
  res.send("Hello, TypeScript + Node.js + Express!");
});

//add sub route
app.use(webhook);
app.use(mainRouter);

export default app;
