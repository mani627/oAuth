const mongoose_config = require("../config/index");
const { mongoose } = mongoose_config;
const moment = require('moment-timezone');

const IST_ZONE = 'Asia/Kolkata'; // IST timezone

// Create a User schema and model
const planSchema = new mongoose.Schema({
  id: String,
  planName: String,
  amount: Number,
  details: String,
  isActive: Boolean,
  duration:String,
  createdAt: { type: Date, default: () => moment.tz(IST_ZONE).toDate() },
  dynamicFields: mongoose.Schema.Types.Mixed,
});

//   create model
const Plan = mongoose.model("subscription_plan", planSchema);

module.exports = Plan;
