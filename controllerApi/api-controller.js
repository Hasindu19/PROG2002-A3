const dbcon = require("../crowdfunding_db"); // import the database
const express = require("express");
const router = express.Router();//map the RESTful endpoints,

//connect to the MySQL database
const connection = dbcon.getconnection();

// Test the connection to ensure it's working
connection.connect((err) => {
  if (err) {
    console.error("Unable to connect to the database:", err);
  } else {
    console.log(
      "Connection to the database has been established successfully."
    );
  }
});

router.get("/fundraisers", (req, res) => {
  const query = `
      SELECT f.FUNDRAISER_ID, f.ORGANIZER, f.CAPTION, f.TARGET_FUNDING, 
             f.CURRENT_FUNDING, f.CITY, f.IMAGE_URL, c.NAME as categoryName
      FROM FUNDRAISER f
      JOIN CATEGORY c ON f.CATEGORY_ID = c.CATEGORY_ID
      WHERE f.ACTIVE = 1
    `;

  connection.query(query, (err, fundraisers) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to retrieve fundraisers",
        error: err.message,
      });
    }
    res.status(200).json(fundraisers);
  });
});

router.get("/categories", (req, res) => {
  const query = `SELECT * FROM CATEGORY`;

  connection.query(query, (err, categories) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to retrieve categories",
        error: err.message,
      });
    }
    res.status(200).json(categories);
  });
});

router.get("/search", (req, res) => {
  const { categoryId, city, organizer, minGoal, maxGoal } = req.query;

  // Start building the base SQL query
  let query = `
      SELECT f.FUNDRAISER_ID, f.ORGANIZER, f.CAPTION, f.TARGET_FUNDING, 
             f.CURRENT_FUNDING, f.CITY, f.IMAGE_URL, c.NAME as categoryName
      FROM FUNDRAISER f
      JOIN CATEGORY c ON f.CATEGORY_ID = c.CATEGORY_ID
      WHERE f.ACTIVE = 1
    `;

  // Array to store query parameters for prepared statement
  const queryParams = [];

  // Add search criteria to the query dynamically
  if (categoryId) {
    const categories = categoryId.split(",");
    query += ` AND f.CATEGORY_ID IN (${categories.map(() => "?").join(",")}) `;
    queryParams.push(...categories);
  }

  if (city) {
    query += ` AND f.CITY = ? `;
    queryParams.push(city);
  }

  if (organizer) {
    query += ` AND f.ORGANIZER = ? `;
    queryParams.push(organizer);
  }

  if (minGoal && maxGoal) {
    query += ` AND f.TARGET_FUNDING BETWEEN ? AND ? `;
    queryParams.push(minGoal, maxGoal);
  } else if (minGoal) {
    query += ` AND f.TARGET_FUNDING >= ? `;
    queryParams.push(minGoal);
  } else if (maxGoal) {
    query += ` AND f.TARGET_FUNDING <= ? `;
    queryParams.push(maxGoal);
  }

  connection.query(query, queryParams, (err, fundraisers) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to retrieve fundraisers",
        error: err.message,
      });
    }
    res.status(200).json(fundraisers);
  });
});

router.get("/fundraiser/:id", (req, res) => {
  const { id } = req.params;
  const query = `
      SELECT f.FUNDRAISER_ID, f.ORGANIZER, f.CAPTION, f.TARGET_FUNDING,f.ACTIVE, 
             f.CURRENT_FUNDING, f.CITY, f.IMAGE_URL, c.NAME as categoryName
      FROM FUNDRAISER f
      JOIN CATEGORY c ON f.CATEGORY_ID = c.CATEGORY_ID
      WHERE f.FUNDRAISER_ID = ? AND f.ACTIVE = 1
    `;

  connection.query(query, [id], (err, fundraiser) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to retrieve fundraiser",
        error: err.message,
      });
    }

    if (fundraiser.length === 0) {
      return res.status(404).json({ message: "Fundraiser not found" });
    }

    res.status(200).json(fundraiser[0]);
  });
});

module.exports = router;