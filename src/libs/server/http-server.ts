// Create an Express application
import express from "express";

const app = express();

// Set the port number for the server

// Define a route for the root path ('/')
app.get("/", (req, res) => {
  // Send a response to the client
  res.send("Hello, TypeScript + Node.js + Express!");
});

export default app;
