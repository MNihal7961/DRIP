const mongoose = require("mongoose");
require("dotenv").config();

const wallet_schema = new mongoose.Schema({
  user: mongoose.Types.ObjectId,
  balance:{type:Number,default:0},
  history:[Object]
});

const wallet = mongoose.model("wallet", wallet_schema);
module.exports = wallet;
