const global = require("../global/globalfunction");
const wishlistHelper = require("../helper/wishlisthelper");

// user-whishlist GET
const userwhishlist_get = async (req, res) => {
  try {
    const title = "user wallet";
    const userData = await global.loggedUser(req.session.email);
    const cartNo = await global.cartCount(userData._id);
    const wishlistData = await global.wishlistData(userData._id);
    const wishlistProduct = await wishlistHelper.productFromWishlist(
      wishlistData
    );
    const wishlistNo=await global.wishlistNo(userData._id)
    res.render("user-whishlist", { title, userData, cartNo, wishlistProduct,wishlistNo });
  } catch (err) {
    res.status(500).render("500");
    console.error(err);
  }
};

// user-add-item POST
const userwhishlistAdd_post = async (req, res) => {
  try {
    const userData = await global.loggedUser(req.session.email);
    const id = req.params.id;
    let result = await wishlistHelper.addToWishlist(userData._id, id);
    if (result == true) {
      res.redirect("/user/wishlist?message=success");
    } else {
      res.redirect("/user/wishlist");
    }
  } catch (err) {
    res.status(500).render("500");
    console.error(err);
  }
};

// user-remove-item DELETE
const userWhislistRemoveItem_delete = async (req, res) => {
  try {
    const userData = await global.loggedUser(req.session.email);
    const id = req.params.id;
    console.log(id);
    const result = await wishlistHelper.removeProductFromWishlist(
      userData._id,
      id
    );
    if (result == true) {
      res.json({ success :true});
    }
  } catch (err) {
    res.status(500).render("500");
    console.error(err);
  }
};

module.exports = {
  userwhishlist_get,
  userwhishlistAdd_post,
  userWhislistRemoveItem_delete,
};
