const mongoose = require("mongoose");
require("dotenv").config();

// Wallet schema
const wallet_schema = new mongoose.Schema({
  user: mongoose.Types.ObjectId,
  balance:Number,
  history:[Object]
});

const wallet = mongoose.model("wallet", wallet_schema);
module.exports = wallet;
