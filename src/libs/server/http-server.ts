// Create an Express application
import express from "express";
import webhook from "@/rest/webhooks";
import { mainRouter } from "@/rest/routes";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import ExpressMongoSanitize from "express-mongo-sanitize";

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use(hpp());
app.use(ExpressMongoSanitize());
//add sanitation, interceptor etc.

// Define a route for the root path ('/')
app.get("/", (req, res) => {
  // Send a response to the client
  res.send("Hello, TypeScript + Node.js + Express!");
});

//add sub route
app.use(webhook);
app.use("/api", mainRouter);

//error handler
app.use((req, res) => {
  res.status(404).send(`API not found : ${req.url}`);
});

export default app;
