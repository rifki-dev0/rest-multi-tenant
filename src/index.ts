// Import the 'express' module
import { httpServer } from "@/libs/server/graph-server";

const port = 3001;

// Start the server and listen on the specified port
// app.listen(port, () => {
//   // Log a message when the server is successfully running
//   console.log(`Server is running on http://localhost:${port}`);
// });
httpServer.listen({ port });
console.log(`Server is running on http://localhost:${port}`);
