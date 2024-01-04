const global = require("../global/globalFunction");
const orderHelper = require("../helper/orderHelpers");
const razorpayHelper = require("../helper/razorpayHelpers");

const placeorder_post = async (req, res) => {
  const { address, payment, shipping, summary } = req.body;
  try {
    const userData = await global.loggedUser(req.session.email);
    const orderShipping = await global.selectShipping(shipping);
    const orderAddress = await global.selectAddress(userData._id, address);
    const orderPrice = global.overallPrice(summary, orderShipping.charge);
    const orderPayment = req.body.payment;
    await orderHelper
      .placeOrder(userData, orderShipping, orderAddress, orderPrice, payment)
      .then(async (orderId) => {
        if (orderPayment == "COD") {
          res.json({ codstatus: true });
        } else {
          razorpayHelper
            .generateRazorPay(userData._id, orderPrice)
            .then((order) => {
              res.json(order);
            });
        }
      });
  } catch (err) {
    throw err;
  }
};

const verifyPayment = async (req, res) => {
  const userData = await global.loggedUser(req.session.email);
  console.log(req.body);
  const { payment, order } = req.body;
  try {
    orderHelper
      .verifyPayment(payment)
      .then(() => {
        res.json({ status: true });
      })
      .catch((err) => {
        res.json({ status: false });
      });
  } catch (err) {
    console.log(err);
  }
};

const ordersuccess_get = async (req, res) => {
  try {
    const title = "order-success";
    const userData = await global.loggedUser(req.session.email);
    const cartNo = await global.cartCount(userData._id);
    res.render("user-order-success", { title, userData, cartNo });
  } catch (err) {
    console.log(err);
  }
};

const orderdetails_get = async (req, res) => {
  try {
    const title = "order-details";
    const userData = await global.loggedUser(req.session.email);
    const cartNo = await global.cartCount(userData._id);
    const orderData = await global.getUserOrders(userData._id);
    const productDetails = await global.getProductDetailsFromOrder(userData._id);
    const count = await global.getOrderProductStatusCount(userData._id);
    const countsArray = count.map(item => item.count)
    const sum = countsArray.reduce((accumulator, currentValue) => accumulator + currentValue, 0)
    console.log(sum)
    var i = 0;
    res.render("user-orders", {
      title,
      cartNo,
      userData,
      orderData,
      productDetails,
      i,
      sum
    });
  } catch (err) {
    console.log(err);
  }
};

const adminorder_get = async (req, res) => {
  const title = "orders";
  var i = 0;
  const productData = await global.getAllOrderProduct();
  const orderData = await global.getAllOrder();
  console.log(productData);
  res.render("admin-order", { title, i, orderData, productData });
};

const adminorderprocess_post = async (req, res) => {
  const { orderId, status } = req.body;
  try {
    await orderHelper
      .adminProcessOrder(orderId, status)
      .then(async (response) => {
        res.json({ updateStatus: true });
      });
  } catch (err) {
    console.log(err);
  }
};

const adminorderplaced_post = async (req, res) => {
  const { orderId, status } = req.body;
  try {
    await orderHelper
      .adminPlaceOrder(orderId, status)
      .then(async (response) => {
        res.json({ updateStatus: true });
      });
  } catch (err) {
    console.log(err);
  }
};

const adminordershipped_post = async (req, res) => {
  const { orderId, status } = req.body;
  try {
    await orderHelper.adminShipOrder(orderId, status).then(async (response) => {
      res.json({ updateStatus: true });
    });
  } catch (err) {
    console.log(err);
  }
};

const adminorderdelivered_post = async (req, res) => {
  const { orderId, status } = req.body;
  try {
    await orderHelper
      .adminDeliveryOrder(orderId, status)
      .then(async (response) => {
        res.json({ updateStatus: true });
      });
  } catch (err) {
    console.log(err);
  }
};

const userordercancel_post = async (req, res) => {
  const userData = await global.loggedUser(req.session.email);

  try {
    const { orderId } = req.body;
    console.log(req.body);
    await orderHelper
      .userCancelOrder(orderId, userData._id)
      .then(async (response) => {
        res.json({ updateStatus: true });
      });
  } catch (err) {
    console.log(err);
  }
};

const userordersingleproductcancel_post = async (req, res) => {
  console.log("WORKED");
  const userData = await global.loggedUser(req.session.email);
  try {
    const { orderId, productName, productSize,productQuantity,productPrice} = req.body;
    console.log(req.body);
    await orderHelper
      .userCancelSingleProduct(userData._id, orderId, productSize, productName,parseInt(productQuantity),parseInt(productPrice))
      .then(async (response) => {
        res.json({ updateStatus: true });
      });
  } catch (err) {
    console.log(err);
  }
};

const userorderreturn_post = async (req, res) => {
  const userData = await global.loggedUser(req.session.email);

  try {
    const { orderId ,orderPrice} = req.body;
    console.log(req.body);
    await orderHelper
      .userReturnOrder(orderId, userData._id,orderPrice)
      .then(async (response) => {
        res.json({ updateStatus: true });
      });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  placeorder_post,
  ordersuccess_get,
  orderdetails_get,
  adminorder_get,
  adminorderprocess_post,
  adminorderplaced_post,
  adminordershipped_post,
  adminorderdelivered_post,
  userordercancel_post,
  userordersingleproductcancel_post,
  verifyPayment,
  userorderreturn_post
};
