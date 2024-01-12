const session = require("express-session");
const users = require("../model/usermodel");
const order = require("../model/ordermodel");
const product = require("../model/productmodel");
const global = require("../global/globalFunction");
const salesHelper = require("../helper/salesReportHelper");

// Admin Datas
const adminData = {
  email: "admin@gmail.com",
  password: "admin",
};

// Adminlogin GET
const adminlogin_get = (req, res) => {
  try {
    if (req.session.adminlogged) {
      res.redirect("/admin/home");
    } else {
      const title = "adminlogin";
      res.render("admin-login", { title });
    }
  } catch (err) {
    res.status(500).render('500')
    console.log(err);
  }
};

// Adminhome GET
const adminhome_get = async (req, res) => {                                     
  try {
    const title = "adminhome";
    const userCount = await users.find({}).count();
    const orderCount = await global.orderCount()
    const totalRevenue = await global.totalRevenue()
    const monthlyRevenue = await salesHelper.monthWiseSales();
    const yearlyRevenue = await salesHelper.yearlySales();
    const yearArray = yearlyRevenue.data.map((item) => item.total);
    const totalValuesArray = monthlyRevenue.data.map((item) => item.total);
    const productCount = await product.countDocuments({});
    const codCount = await global.codCount();
    const onlineCount = await global.onlineCount();
    const weeklyData= await salesHelper.weekWiseSales()
    console.log(weeklyData);
    res.render("admin-home", {
      yearArray,
      totalValuesArray,
      title,
      userCount,
      orderCount,
      totalRevenue,
      productCount,
      onlineCount,
      codCount,
      weeklyData
    });
  } catch (err) {
    res.status(500).render('500')
    console.log(err);
  }
};

// Adminlogin POST
const adminlogin_post = (req, res) => {
  try {
    const { email, password } = req.body;
    if (adminData.email === email && adminData.password === password) {
      req.session.email = email;
      req.session.password = password;
      req.session.adminlogged = true;
      res.redirect("/admin/home");
    } else {
      res.redirect("/admin/login");
    }
  } catch (err) {
    res.status(500).render('500')
    console.log(err);
  }
};

// Adminlogout GET
const adminlogout_get = (req, res) => {
  try {
    res.redirect("/");
    req.session.adminlogged = false;
    req.session.destroy();
  } catch (err) {
    res.status(500).render('500')
    console.log(err);
  }
};

// Adminblock POST
const adminblock_post = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const block = await users.updateOne(
      { _id: id },
      { $set: { status: false } }
    );
    return res.redirect("/admin/user");
  } catch (err) {
    res.status(500).render('500')
    console.log(err);
  }
};

// Admin unblock POST
const adminunblock_post = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const unblock = await users.updateOne(
      { _id: id },
      { $set: { status: true } }
    );
    return res.redirect("/admin/user");
  } catch (err) {
    res.status(500).render('500')
    console.log(err);
  }
};

// Admin users GET
const adminuser_get = async (req, res) => {
  try {
    const title = "usermanagement";
    var i = 0;
    const blockeduser = await users.find({ status: false }).count();
    const unblockuser = await users.find({ status: true }).count();
    const userCount = await users.find().count();
    const userData = await users
      .find()
      .sort({ username: 1, email: 1, password: 1, status: 1 });
    res.render("admin-user", { title, userData, i });
  } catch (err) {
    res.status(500).render('500')
    console.log(err);
  }
};


module.exports = {
  adminlogin_get,
  adminlogin_post,
  adminhome_get,
  adminlogout_get,
  adminblock_post,
  adminunblock_post,
  adminuser_get,
};
