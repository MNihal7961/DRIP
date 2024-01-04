const mongoose = require("mongoose");
require("dotenv").config();

const cart_schema = new mongoose.Schema({
  user: mongoose.Types.ObjectId,
  cartItems: [
    {
      products: mongoose.Types.ObjectId,
      quantity: Number,
      size: Number,
    },
  ],
});

const cart = mongoose.model("cart", cart_schema);
module.exports = cart;
