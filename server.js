const express = require("express");
const cors = require("cors"); // Add CORS middleware

const apiController = require("./controllerApi/api-controller");

const app = express();

app.use(cors()); // Enable CORS for all routes

// Use the router for API endpoints
app.use('/api', apiController)

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
