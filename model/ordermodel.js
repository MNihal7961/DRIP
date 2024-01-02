const mongoose = require("mongoose");
require("dotenv").config();

const order_schema = new mongoose.Schema({
  user: mongoose.Types.ObjectId,
  order: [
    {
      buyerName: String,
      sellerName: { type: String, default: "Drip-Store" },
      shippingAddress: Object,
      billingAddress: Object,
      totalPrice: Number,
      paymentMethod: String,
      paymentStatus: { type: String, default: "pending" },
      totalQuantity: Number,
      shippingMethod: String,
      productDetails: Array,
      orderStatus: {
        type: String,
        default: "Pending",
      },
      orderedAt: {
        type: Date,
        default: new Date(),
      },
      deliveredAt: {
        type: Date,
      }
    },
  ],
});

const order = mongoose.model("order", order_schema);
module.exports = order;
