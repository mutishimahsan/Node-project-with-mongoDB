const mongoose = require('mongoose');

require('dotenv').config();

// Define the MongoDB connection URL
// const mongoUrlLocal = process.env.mongoDB_URL_Local;
const mongoUrl = process.env.mongoDB_URL;

// Set up MongoDB connection
mongoose.connect(mongoUrl)

// Get the default connection
// Mongoose maintains a default connection object representing the MongoDB connection.
const db = mongoose.connection;

// Define the event listeners for database connection
db.on('connected', () => {
    console.log("Connected to MongoDB server");
})

db.on('error', (err) => {
    console.log("MongoDB connection error:", err);
})

db.on('disconnected', () => {
    console.log("MongoDB disconnected");
})

// Export the connection
module.exports = db;