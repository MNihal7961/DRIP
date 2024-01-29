const wallet = require("../model/walletmodel");
const global = require("../global/globalFunction");
const { ObjectId } = require("mongodb");
const razorpayHelper=require('../helper/razorpayHelpers')
const walletHelper=require('../helper/walletHelpers')

const userwallet_get = async (req, res) => {
  try {
    const title = "user wallet";
    const userData = await global.loggedUser(req.session.email);
    const cartNo = await global.cartCount(userData._id);
    const wishlistNo=await global.wishlistNo(userData._id)
    const walletData = await global.walletdata(userData._id);
    console.log(walletData)
    res.render("user-wallet", { title, userData, cartNo, walletData,wishlistNo });
  } catch (err) {
    res.status(500).render('500')
    console.log(err);
  }
};

const userActivateWallet_get = async (req, res) => {
  try {
    const { id } = req.body;
    const existwallet = await wallet.findOne({ user: new ObjectId(id) });
    if (existwallet) {
      res.redirect("/user/wallet?message=you already activated your wallet");
    } else {
      const userwallet = await wallet.create({
        user:id,
      });
      res.redirect("/user/wallet?message=wallet activated");
    }
  } catch (err) {
    res.status(500).render('500')
    console.log(err);
  }
};

const userwallettTopup_post=async(req,res)=>{
  try{
    const {amount}=req.body
    const userData = await global.loggedUser(req.session.email);
    await walletHelper.topUpWallet(userData._id,parseInt(amount)).then(async(walletId)=>{
      razorpayHelper.generateRazorPayWalletTopUp(userData._id,parseInt(amount)).then((order) => {
        res.json({status:true});
      })
    })
   
  }catch(err){
    res.status(500).render('500')
    console.error(err)
  }
}

module.exports = { 
  userwallet_get,
  userActivateWallet_get,
  userwallettTopup_post
};
