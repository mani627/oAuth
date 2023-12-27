const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

// Connect to MongoDB (replace 'your_database_url' with your actual MongoDB connection string)
mongoose.connect(process.env.MONGO_CON);

// Get the default connection
const db = mongoose.connection;

// Bind connection to error event
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});


const sender = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "mani8754209@gmail.com",
    pass: process.env.NODEMAILER_GMAIL_PASS,
  },
});

module.exports= {mongoose,sender}