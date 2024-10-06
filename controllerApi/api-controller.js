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

//Updated get method for assessment3 part 2
router.get('/fundraiser/:id', (req, res) => {
  const fundraiserId = req.params.id;

  const query = `
    SELECT f.FUNDRAISER_ID, f.CAPTION, f.ORGANIZER, f.TARGET_FUNDING, f.CURRENT_FUNDING, 
           f.CITY, f.ACTIVE, f.IMAGE_URL, c.NAME as categoryName,
           d.DONATION_ID, d.DATE, d.AMOUNT, d.GIVER
    FROM FUNDRAISER f
    JOIN CATEGORY c ON f.CATEGORY_ID = c.CATEGORY_ID
    LEFT JOIN DONATION d ON f.FUNDRAISER_ID = d.FUNDRAISER_ID
    WHERE f.FUNDRAISER_ID = ?
  `;

  connection.query(query, [fundraiserId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching fundraiser details', error: err.message });
    }

    // If no fundraiser found, return a 404
    if (results.length === 0) {
      return res.status(404).json({ message: 'Fundraiser not found' });
    }

    // Format the result into an object that includes fundraiser details and donations
    const fundraiser = {
      fundraiserId: results[0].FUNDRAISER_ID,
      caption: results[0].CAPTION,
      organizer: results[0].ORGANIZER,
      targetFunding: results[0].TARGET_FUNDING,
      currentFunding: results[0].CURRENT_FUNDING,
      city: results[0].CITY,
      active: results[0].ACTIVE === 1 ? 'Active' : 'Inactive',
      category: results[0].categoryName,
      imageUrl: results[0].IMAGE_URL,
      donations: results.filter(donation => donation.DONATION_ID !== null).map(donation => ({
        donationId: donation.DONATION_ID,
        date: donation.DATE,
        amount: donation.AMOUNT,
        giver: donation.GIVER
      }))
    };

    res.status(200).json(fundraiser);
  });
});

// POST Method to Insert a New Donation
router.post('/donation', (req, res) => {
  const { date, amount, giver, fundraiserId } = req.body;

  const query = `INSERT INTO DONATION (DATE, AMOUNT, GIVER, FUNDRAISER_ID) VALUES (?, ?, ?, ?)`;

  connection.query(query, [date, amount, giver, fundraiserId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error inserting donation', error: err.message });
    }
    res.status(201).json({ message: 'Donation added successfully', donationId: result.insertId });
  });
});

// POST Method to Insert a New Fundraiser
router.post('/fundraisers', (req, res) => {
  const { caption, organizer, targetFunding, city, categoryId, imageUrl } = req.body;

  const query = `INSERT INTO FUNDRAISER (CAPTION, ORGANIZER, TARGET_FUNDING, CURRENT_FUNDING, CITY, ACTIVE, CATEGORY_ID, IMAGE_URL) VALUES (?, ?, ?, 0, ?, 1, ?, ?)`;

  connection.query(query, [caption, organizer, targetFunding, city, categoryId, imageUrl], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error creating fundraiser', error: err.message });
    }
    res.status(201).json({ message: 'Fundraiser created successfully', fundraiserId: result.insertId });
  });
});

// PUT Method to Update an Existing Fundraiser
router.put('/fundraisers/:id', (req, res) => {
  const fundraiserId = req.params.id;
  const { caption, organizer, targetFunding, city, categoryId, imageUrl } = req.body;

  const query = `UPDATE FUNDRAISER SET CAPTION = ?, ORGANIZER = ?, TARGET_FUNDING = ?, CITY = ?, CATEGORY_ID = ?, IMAGE_URL = ? WHERE FUNDRAISER_ID = ?`;

  connection.query(query, [caption, organizer, targetFunding, city, categoryId, imageUrl, fundraiserId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error updating fundraiser', error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Fundraiser not found' });
    }

    res.status(200).json({ message: 'Fundraiser updated successfully' });
  });
});

//DELETE Method to Delete a Fundraiser
router.delete('/fundraisers/:id', (req, res) => {
  const fundraiserId = req.params.id;

  // First, check if the fundraiser has any donations
  const checkDonationsQuery = `SELECT COUNT(*) AS donationCount FROM DONATION WHERE FUNDRAISER_ID = ?`;

  connection.query(checkDonationsQuery, [fundraiserId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error checking donations', error: err.message });
    }

    // If donations exist, prevent deletion
    if (results[0].donationCount > 0) {
      return res.status(400).json({ message: 'Cannot delete fundraiser with donations' });
    }

    // If no donations, proceed to delete the fundraiser
    const deleteFundraiserQuery = `DELETE FROM FUNDRAISER WHERE FUNDRAISER_ID = ?`;

    connection.query(deleteFundraiserQuery, [fundraiserId], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error deleting fundraiser', error: err.message });
      }

      // Check if any rows were affected (if the fundraiser existed)
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Fundraiser not found' });
      }

      res.status(200).json({ message: 'Fundraiser deleted successfully' });
    });
  });
});

// GET Method to Retrieve All Fundraisers (regardless of their status)
router.get('/allfundraisers', (req, res) => {
  const query = `
    SELECT FUNDRAISER_ID, CAPTION, ORGANIZER, TARGET_FUNDING, CURRENT_FUNDING, CITY, ACTIVE
    FROM FUNDRAISER
  `;

  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching fundraisers', error: err.message });
    }
    res.status(200).json(results);
  });
});


module.exports = router;