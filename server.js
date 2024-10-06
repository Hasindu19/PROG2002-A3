const express = require("express");
const cors = require("cors"); // Add CORS middleware
const bodyParser = require('body-parser');  

const apiController = require("./controllerAPI/api-controll");

const app = express();
// Middleware for parsing JSON and URL-encoded form data
app.use(bodyParser.json());  // Parse application/json
app.use(bodyParser.urlencoded({ extended: true }));  // Parse application/x-www-form-urlencoded
app.use(cors());

// Use the router for API endpoints
app.use('/api', apiController)

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
