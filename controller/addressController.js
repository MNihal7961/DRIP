const users = require("../model/usermodel");
const address = require("../model/addressmodel");
const { ObjectId } = require("mongodb");
const userHelper = require("../helper/userHelpers");
const cart = require("../model/cartmodel");
const global = require("../global/globalfunction");

// User-address-book GET
const addressbook_get = async (req, res) => {
  try {
    const title = "address-book";
    const userData = await users.findOne({ email: req.session.email });
    const addressData = await address.findOne({ user: userData._id });
    const cartItems = await cart.findOne({ user: userData._id });
    const cartNo = await global.cartCount(userData._id);
    const wishlistNo=await global.wishlistNo(userData._id)
    res.render("user-address-book", {
      title,
      userData,
      addressData,
      cartItems,
      cartNo,
      wishlistNo
    });
  } catch (err) {
    res.status(500).render("500");
    console.log(err);
  }
};

// user-add-address GET
const addaddress_get = async (req, res) => {
  try {
    const title = "add-address";
    const userData = await users.findOne({ email: req.session.email });
    const cartItems = await cart.findOne({ user: userData._id });
    const cartNo = await global.cartCount(userData._id);
    const wishlistNo=await global.wishlistNo(userData._id)
    res.render("user-add-address", { title, userData, cartItems, cartNo ,wishlistNo});
  } catch (err) {
    res.status(500).render("500");
    console.log(err);
  }
};

// user-add-address POST
const addaddress_post = async (req, res) => {
  try {
    const data = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      street: req.body.street,
      building: req.body.building,
      city: req.body.city,
      state: req.body.state,
      pincode: req.body.pincode,
      mobile: req.body.mobile,
      email: req.body.email,
    };
    const userData = await users.findOne({ email: req.session.email });
    userHelper.addNewAddress(userData._id, data).then((response) => {
      res.redirect("/user/address/book?message=successfully added new address");
    });
  } catch (err) {
    res.status(500).render("500");
    console.log(err);
  }
};

// user-edit-adress GET
const editaddress_get = async (req, res) => {
  const id = req.params.id;
  const title = "edit-address";
  const userData = await users.findOne({ email: req.session.email });
  const cartItems = await cart.findOne({ user: userData._id });
  const cartNo = await global.cartCount(userData._id);
  const wishlistNo=await global.wishlistNo(userData._id)
  try {
    const data = await address.aggregate([
      { $match: { user: new ObjectId(userData._id) } },
      { $unwind: "$address" },
      { $match: { "address._id": new ObjectId(id) } },
    ]);

    const addressField = data[0].address;
    res.render("user-edit-address", {
      title,
      id,
      userData,
      addressField,
      data,
      cartItems,
      cartNo,
      wishlistNo
    });
  } catch (err) {
    res.status(500).render("500");
    console.log(err);
    throw err;
  }
};

// user-edit-address POST
const editaddress_post = async (req, res) => {
  const id = req.params.id;
  console.log(req.body);
  const data = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    street: req.body.street,
    building: req.body.building,
    city: req.body.city,
    state: req.body.state,
    pincode: req.body.pincode,
    mobile: req.body.mobile,
    email: req.body.email,
  };

  try {
    const userData = await users.findOne({ email: req.session.email });
    if (!userData) {
      throw new Error("User data not found");
    }

    const editResult = await userHelper.editAddress(data, userData._id, id);

    if (editResult.status) {
      res.redirect(
        "/user/address/book?message=successfully updated your address"
      );
    } else {
      throw new Error("Failed to update address");
    }
  } catch (err) {
    console.log(err);
    res.status(500).render("500");
  }
};

// user-delete-address GET
const deleteaddress_get = async (req, res) => {
  const id = req.params.id;
  const userData = await users.findOne({ email: req.session.email });
  try {
    const deleteAddress = await address.updateOne(
      {
        user: userData._id,
      },
      {
        $pull: { address: { _id: id } },
      }
    );
    if (deleteAddress) {
      res.redirect("/user/address/book?successfully deleted address");
    }
  } catch (err) {
    console.log(err);
  }
};

// user-address-add-checkout POST
const addaddresscheckout_post = async (req, res) => {
  try {
    console.log(req.body);
    const data = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      street: req.body.street,
      building: req.body.buildingName,
      city: req.body.city,
      state: req.body.state,
      pincode: req.body.pincode,
      mobile: req.body.phoneNumber,
      email: req.body.email,
    };
    const userData = await users.findOne({ email: req.session.email });
    userHelper.addNewAddress(userData._id, data).then((response) => {
      res.redirect("/user/checkout?message=successfully added new address");
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  addressbook_get,
  addaddress_get,
  addaddress_post,
  editaddress_get,
  editaddress_post,
  deleteaddress_get,
  addaddresscheckout_post,
};
