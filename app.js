const express = require('express');
require("dotenv").config();
const DATABASE_URL = process.env.DATABASE_URL;
const mongoose = require('mongoose');
const routerS = require('./routes/adminRoutes');

const app = express();
const PORT = 2001;

app.use(express.json());  // Middleware to parse JSON

// Use the routes
app.use(routerS);

// Error handling middleware (it should be after routes)
app.use((err, req, res, next) => {
  // Handle any errors that come up in the routes
  if (err) {
    return res.status(400).json({ message: err.message });
  }

  next();
});

// Connect to the database and start the server
mongoose.connect(DATABASE_URL).then(() => {
  console.log("Database connected successfully");

  app.listen(PORT, () => {
    console.log(`Server is listening on PORT: ${PORT}`);
  });
}).catch((err) => {
  console.log("Unable to connect to DB because " + err);
});
