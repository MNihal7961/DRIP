const cart = require("../model/cartmodel");
const product = require("../model/productmodel");
const { ObjectId } = require("mongodb");
const order = require("../model/ordermodel");
require("dotenv").config();
const Razorpay = require("razorpay");
const crypto = require("crypto");
const wallet = require("../model/walletmodel");

const instance = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET,
});

const placeOrder = (user, shipping, address, total, payment) => {
  return new Promise(async (resolve, reject) => {
    try {
      let products = await cart.aggregate([
        {
          $match: { user: new ObjectId(user._id) },
        },
        {
          $unwind: "$cartItems",
        },
        {
          $project: {
            item: "$cartItems.products",
            quantity: "$cartItems.quantity",
            size: "$cartItems.size",
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "item",
            foreignField: "_id",
            as: "cartItemsRs",
          },
        },
        {
          $unwind: "$cartItemsRs",
        },
        {
          $project: {
            _id: "$cartItemsRs._id",
            quantity: 1,
            size: 1,
            productsName: "$cartItemsRs.title",
            productsPrice: "$cartItemsRs.sellingprice",
            productImage: "$cartItemsRs.images",
          },
        },
      ]);

      //totalQuatity calculation
      let totalQuantity = products.reduce(
        (acc, curr) => acc + curr.quantity,
        0
      );

      //address
      let Address = {
        fname: address[0].address.fname,
        lname: address[0].address.lname,
        street: address[0].address.street,
        buildingName: address[0].address.buildingName,
        city: address[0].address.city,
        state: address[0].address.state,
        pincode: address[0].address.pincode,
        mobile: address[0].address.mobile,
        email: address[0].address.email,
      };

      // Inventory management - Update product quantities
      for (let i = 0; i < products.length; i++) {
        const productId = products[i]._id;
        const sizeToUpdate = products[i].size;
        const quantityToUpdate = products[i].quantity;

        await product.updateOne(
          {
            _id: productId,
            "varient.size": sizeToUpdate,
          },
          {
            $inc: { "varient.$.quantity": -quantityToUpdate },
          }
        );
      }

      const mappedProducts = products.map((product) => ({
        quantity: product.quantity,
        size: product.size,
        _id: product._id,
        productsName: product.productsName,
        productsPrice: product.productsPrice,
        productImage: product.productImage,
        status: true,
      }));

      let paymentStatus = "";
      if (payment == "COD") {
        paymentStatus = "Pending";
      } else {
        paymentStatus = "Paid";
      }

      let orderData = {
        userId: user._id,
        buyerName: user.username,
        shippingAddress: Address,
        billingAddress: Address,
        totalPrice: total,
        paymentMethod: payment,
        paymentStatus: paymentStatus,
        totalQuantity: totalQuantity,
        shippingMethod: shipping.title,
        productDetails: mappedProducts,
      };

      const orderExist = await order.findOne({ user: user._id });

      if (orderExist) {
        await order.updateOne(
          { user: user._id },
          { $push: { order: orderData } }
        );
        resolve({ order: "success" });
      } else {
        const newOrder = new order({
          user: user._id,
          order: [orderData],
        });

        await newOrder.save();
        resolve({ order: "success" });
      }

      cart.deleteMany({ user: new ObjectId(user._id) }).then((response) => {
        resolve({ order: "success" });
      });
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};

const generateRazorPay = async (userId, total) => {
  const ordersDetails = await find({ user: new ObjectId(userId) });
  let orders = ordersDetails[0]?.order?.slice()?.reverse();
  let orderId = orders[0]._id;
  total = total * 100;
  return new Promise((resolve, reject) => {
    try {
      var options = {
        amount: total,
        currency: "INR",
        receipt: "" + orderId,
      };
      instance.orders.create(options, function (err, order) {
        resolve(order);
      });
    } catch (err) {
      console.Consolelog(err);
    }
  });
};

const verifyPayment = async (payment) => {
  return new Promise((resolve, reject) => {
    try {
      console.log("verifypayment called");
      let hmac = crypto.createHmac("sha256", "6dMOUSzCg1h01Q3TW0mmq6UR");
      hmac.update(
        payment.razorpay_order_id + "|" + payment.razorpay_payment_id
      );
      hmac = hmac.digest("hex");
      console.log(hmac + "00");
      console.log(payment.razorpay_signature + "00");
      if (hmac === payment.razorpay_signature) {
        resolve();
      } else {
        reject("not match");
      }
    } catch (err) {
      console.log(err);
    }
  });
};

const changePaymentStatus = (userId, orderId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let orders = await find({ user: userId });
      let orderIndex = orders[0].order.findIndex(
        (order) => order._id == orderId
      );
      await order
        .updateOne(
          {
            "order._id": new ObjectId(orderId),
          },
          {
            $set: {
              ["order." + orderIndex + ".paymentStatus"]: "PAID",
            },
          }
        )
        .then((data) => {
          resolve();
        });
    } catch (err) {
      console.log(err);
    }
  });
};

const adminProcessOrder = (orderId, status) => {
  return new Promise(async (resolve, reject) => {
    try {
      await order
        .updateOne(
          { "order._id": new ObjectId(orderId) },
          { $set: { "order.$.orderStatus": status } }
        )
        .then((response) => {
          resolve({ update: "success" });
        });
    } catch (err) {
      console.log(err);
    }
  });
};

const adminPlaceOrder = (orderId, status) => {
  return new Promise(async (resolve, reject) => {
    try {
      await order
        .updateOne(
          { "order._id": new ObjectId(orderId) },
          { $set: { "order.$.orderStatus": status } }
        )
        .then((response) => {
          resolve({ update: "success" });
        });
    } catch (err) {
      console.log(err);
    }
  });
};

const adminShipOrder = (orderId, status) => {
  return new Promise(async (resolve, reject) => {
    try {
      await order
        .updateOne(
          { "order._id": new ObjectId(orderId) },
          { $set: { "order.$.orderStatus": status } }
        )
        .then((response) => {
          resolve({ update: "success" });
        });
    } catch (err) {
      console.log(err);
    }
  });
};

const adminDeliveryOrder = (orderId, status) => {
  return new Promise(async (resolve, reject) => {
    try {
      const currentDate = new Date(); // Get the current date

      await order
        .updateOne(
          { "order._id": new ObjectId(orderId) },
          {
            $set: {
              "order.$.orderStatus": status,
              "order.$.paymentStatus": "Paid",
              "order.$.deliveredAt": currentDate,
            },
          }
        )
        .then((response) => {
          resolve({ update: "success" });
        });
    } catch (err) {
      console.log(err);
      reject(err); // Reject promise if an error occurs
    }
  });
};

const userCancelOrder = async (orderId, userId, reason) => {
  try {
    // Find the order
    const orderCancel = await order.findOne(
      { user: new ObjectId(userId) },
      { order: { $elemMatch: { _id: new ObjectId(orderId) } } }
    );
    console.log(orderCancel,'0000000000000')

    if (!orderCancel || !orderCancel.order || orderCancel.order.length === 0) {
      throw { error: 'Order not found.' };
    }

    const canceledOrder = orderCancel.order[0];

    // Calculate total refund amount
    let totalRefundAmount = 0;

    if (canceledOrder.paymentStatus =='Paid') {
      totalRefundAmount = canceledOrder.totalPrice;

      // Update wallet
      const existWallet = await wallet.findOne({
        user: new ObjectId(userId),
      });

      if (existWallet) {
        await existWallet.updateOne({
          $inc: { balance: parseInt(totalRefundAmount) },
          $push: {
            history: {
              type: 'Credited',
              amount: parseInt(totalRefundAmount),
              date: new Date(),
              description: 'Order Cancel Refund',
            },
          },
        });
      } else {
        await wallet.create({
          user: new ObjectId(userId),
          balance: parseInt(totalRefundAmount),
          history: [
            {
              type: 'Credited',
              amount: parseInt(totalRefundAmount),
              date: new Date(),
              description: 'Order Cancel Refund',
            },
          ],
        });
      }
    }

    // Update order status and payment status
    await order.updateOne(
      {
        user: new ObjectId(userId),
        'order._id': new ObjectId(orderId),
      },
      {
        $set: {
          'order.$.orderStatus': 'Cancelled',
          'order.$.cancelReason': reason,
          'order.$.paymentStatus': canceledOrder.paymentStatus === 'Paid' ? 'Refunded' : canceledOrder.paymentStatus,
        },
      }
    );

    return { update: 'success' };
  } catch (err) {
    console.error(err);
    throw { error: 'An error occurred.' };
  }
};

const userCancelSingleProduct = (
  userId,
  orderId,
  productSize,
  productName,
  productQuantity,
  productPrice
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await order.updateOne(
        {
          user: new ObjectId(userId),
          "order._id": new ObjectId(orderId),
          "order.productDetails": {
            $elemMatch: {
              productsName: productName,
              size: parseInt(productSize),
            },
          },
        },
        {
          $set: {
            "order.$.productDetails.$[elem].status": false,
          },
          $inc: {
            "order.$.totalPrice": -1 * productQuantity * productPrice,
            "order.$.totalQuantity": -1 * productQuantity,
            "order.$.productDetails.$[elem].quantity": -1 * productQuantity,
            "order.$.productDetails.$[elem].productsPrice": -1 * productPrice,
          },
        },
        {
          arrayFilters: [
            {
              "elem.productsName": productName,
              "elem.size": parseInt(productSize),
            },
          ],
        }
      );

      console.log(result[0]);

      if (result.nModified > 0) {
        await product.updateOne(
          {
            title: productName,
            "varient.size": parseInt(productSize),
          },
          {
            $inc: { "varient.$.quantity": productQuantity },
          }
        );
        resolve({ update: "success" });
      } else {
        resolve({ update: "failed", reason: "No modifications" });
      }
    } catch (err) {
      reject(err);
    }
  });
};

const userReturnOrderRequest = (orderId, userId, reason) => {
  return new Promise(async (resolve, reject) => {
    try {
      await order
        .updateOne(
          { user: userId, "order._id": new ObjectId(orderId) },
          {
            $set: {
              "order.$.orderStatus": "Returned Request Sented",
              "order.$.returnReason": reason,
            },
          }
        )
        .then((response) => {
          resolve({ update: "success" });
        });
    } catch (err) {
      console.log(err);
    }
  });
};

const adminConfirmReturn = async (total, orderId) => {
  try {
    const orderReturn = await order.findOne({
      order: { $elemMatch: { _id: new ObjectId(orderId) } },
    });
    const result = await order.updateOne(
      {
        user: new ObjectId(orderReturn.user),
        "order._id": new ObjectId(orderId),
      },
      {
        $set: {
          "order.$.orderStatus": "Returned",
          "order.$.paymentStatus":"Refunded"
        },
      }
    );
    const existWallet = await wallet.findOne({
      user: new ObjectId(orderReturn.user),
    });
    if (existWallet) {
      const totalRefundAmount = orderReturn.totalPrice;

      await existWallet.updateOne({
        $inc: { balance: parseInt(total) },
        $push: {
          history: {
            type: "Credited",
            amount: parseInt(total),
            date: new Date(),
            description: "Order Return Refund",
          },
        },
      });
      return true;
    } else {
      await wallet.create({
        user: new ObjectId(orderReturn.user),
        balance: parseInt(total),
        history: [
          {
            type: "Credited",
            amount: parseInt(total),
            date: new Date(),
            description: "Order Return Refund",
          },
        ],
      });
      return true;
    }
  } catch (err) {
    console.error(err);
  }
};

const adminRejectReturn=async (orderId,reason)=>{
  try{
    const orderReturn = await order.findOne({
      order: { $elemMatch: { _id: new ObjectId(orderId) } },
    });
    const result = await order.updateOne(
      {
        user: new ObjectId(orderReturn.user),
        "order._id": new ObjectId(orderId),
      },
      {
        $set: {
          "order.$.orderStatus": "Return Rejected",
          "order.$.rejectReason":reason
        }
      }
    )
    if(result){
      return true
    }
  }catch(err){
    console.error(err)
  }
}

const placeOrderWallet=async (user, shipping, address, total, payment)=>{
  return new Promise(async (resolve, reject) => {
    try {
      let products = await cart.aggregate([
        {
          $match: { user: new ObjectId(user._id) },
        },
        {
          $unwind: "$cartItems",
        },
        {
          $project: {
            item: "$cartItems.products",
            quantity: "$cartItems.quantity",
            size: "$cartItems.size",
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "item",
            foreignField: "_id",
            as: "cartItemsRs",
          },
        },
        {
          $unwind: "$cartItemsRs",
        },
        {
          $project: {
            _id: "$cartItemsRs._id",
            quantity: 1,
            size: 1,
            productsName: "$cartItemsRs.title",
            productsPrice: "$cartItemsRs.sellingprice",
            productImage: "$cartItemsRs.images",
          },
        },
      ]);

      //totalQuatity calculation
      let totalQuantity = products.reduce(
        (acc, curr) => acc + curr.quantity,
        0
      );

      //address
      let Address = {
        fname: address[0].address.fname,
        lname: address[0].address.lname,
        street: address[0].address.street,
        buildingName: address[0].address.buildingName,
        city: address[0].address.city,
        state: address[0].address.state,
        pincode: address[0].address.pincode,
        mobile: address[0].address.mobile,
        email: address[0].address.email,
      };

      // Inventory management - Update product quantities
      for (let i = 0; i < products.length; i++) {
        const productId = products[i]._id;
        const sizeToUpdate = products[i].size;
        const quantityToUpdate = products[i].quantity;

        await product.updateOne(
          {
            _id: productId,
            "varient.size": sizeToUpdate,
          },
          {
            $inc: { "varient.$.quantity": -quantityToUpdate },
          }
        );
      }

      const mappedProducts = products.map((product) => ({
        quantity: product.quantity,
        size: product.size,
        _id: product._id,
        productsName: product.productsName,
        productsPrice: product.productsPrice,
        productImage: product.productImage,
        status: true,
      }));

      let paymentStatus = "";
      if (payment == "COD") {
        paymentStatus = "Pending";
      } else {
        paymentStatus = "Paid";
      }

      let orderData = {
        userId: user._id,
        buyerName: user.username,
        shippingAddress: Address,
        billingAddress: Address,
        totalPrice: total,
        paymentMethod: payment,
        paymentStatus: paymentStatus,
        totalQuantity: totalQuantity,
        shippingMethod: shipping.title,
        productDetails: mappedProducts,
      };

      const orderExist = await order.findOne({ user: user._id });

      if (orderExist) {
        await order.updateOne(
          { user: user._id },
          { $push: { order: orderData } }
        );
        resolve({ order: "success" });
      } else {
        const newOrder = new order({
          user: user._id,
          order: [orderData],
        });

        await newOrder.save();
        resolve({ order: "success" });
      }
      await wallet.updateOne(
        { user: new ObjectId(user._id) },
        {
        $inc: { balance: -parseInt(total) },
        $push: {
          history: {
            type: "Debited",
            amount: parseInt(total),
            date: new Date(),
            description: "For Shopping",
          },
        },
        },)
      cart.deleteMany({ user: new ObjectId(user._id) }).then((response) => {
        resolve({ order: "success" });
      });
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
}

const orderDataForInvoice=async(userId,orderId)=>{
  const orderCancel = await order.findOne(
    { user: new ObjectId(userId) },
    { order: { $elemMatch: { _id: new ObjectId(orderId) } } }
  );
return orderCancel
}

module.exports = {
  placeOrder,
  generateRazorPay,
  verifyPayment,
  changePaymentStatus,
  adminProcessOrder,
  adminPlaceOrder,
  adminShipOrder,
  adminDeliveryOrder,
  userCancelOrder,
  userCancelSingleProduct,
  userReturnOrderRequest,
  adminConfirmReturn,
  adminRejectReturn,
  placeOrderWallet,
  orderDataForInvoice
};
