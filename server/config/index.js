const mongoose = require("mongoose");


// Connect to MongoDB (replace 'your_database_url' with your actual MongoDB connection string)
mongoose.connect(process.env.MONGO_CON);

// Get the default connection
const db = mongoose.connection;

// Bind connection to error event
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

module.exports= mongoose