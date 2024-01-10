const express = require('express')
const router = express.Router()
const userController = require('../controller/userController')
const userAuth = require('../middleware/userAuth')
const brand = require('../model/brandmodel')
const product = require('../model/productmodel')
const addressController = require('../controller/addressController')
const cartController = require('../controller/cartController')
const profileController = require('../controller/profileController')
const orderController = require('../controller/orderController')
const upload = require('../middleware/profileMulter')
const walletController=require('../controller/walletController')
const whishlistController=require('../controller/wishlistController')


// DEMO PAGE GET
router.get('/', async (req, res) => {
    if(req.session.userlogged){
        res.redirect('/user/home')
    }
    const title = "home"
    const brandData = await brand.find()
    const productData = await product.find()
    res.render('main', { title, brandData, productData })
})

// User-home GET
router.get('/user/home', userAuth.authMiddleware, userController.userhome_get)

// Signup
router.get('/user/signup',userController.usersignup_get)

//OTP GET
router.get('/user/otp', userController.userotp_get)
router.post('/user/signup', userController.userSignUpOTP_post)
router.post('/user/otp', userController.userSignUpOTPValidate_post)
router.post('/user/upload/profileImage', upload.single('profileimage'), profileController.editprofileImage)

// User-otp-resend POST
router.post('/user/resend/otp',userController.resendOtp)

// Login
router.get('/user/login', userController.userlogin_get)
router.post('/user/login', userController.userlogin_post)

// Logout
router.get('/user/logout', userAuth.authMiddleware, userController.userlogout_get)

// Forgott-password
router.get('/user/forgott/password',userController.userForgottPassword_get)
router.post('/user/forgott/password',userController.userForgottPassword_post)
router.post('/user/forgott/otp',userController.userforgottOTPvalidate_post)
router.post('/user/new/password',userController.usernewpassword_post)

// User-view-black-friday-sale GET
router.get('/user/black-friday-sale', userAuth.authMiddleware, userController.blackfridaysale_get)

// Product details GET
router.get('/user/product/details/:id', userAuth.authMiddleware, userController.userproductdetails_GET)

// Address-page GET
router.get('/user/address/book', userAuth.authMiddleware, addressController.addressbook_get)

// Add-address
router.get('/user/add/address', userAuth.authMiddleware, addressController.addaddress_get)
router.post('/user/add/address', userAuth.authMiddleware, addressController.addaddress_post)

// Edit-address
router.get('/user/edit/address/:id', userAuth.authMiddleware, addressController.editaddress_get)
router.post('/user/edit/address/:id', userAuth.authMiddleware, addressController.editaddress_post)

// Delete-address GET
router.get('/user/delete/address/:id', userAuth.authMiddleware, addressController.deleteaddress_get)

// Profile details GET
router.get('/user/profile/:id', userAuth.authMiddleware, profileController.userprofile_get)

// Edit-profile GET
router.get('/user/edit/profile/:id', userAuth.authMiddleware, profileController.usereditprofile_get)
router.post('/user/edit/profile/:id', userAuth.authMiddleware, profileController.usereditprofile_post)

// reset-password GET
router.get('/user/reset/password', userAuth.authMiddleware, profileController.userresetpassword_get)
router.post('/user/reset/password', userAuth.authMiddleware, profileController.userresetpassword_post)

// User-cart GET
router.get('/user/cart', userAuth.authMiddleware, cartController.cart_get)

// User-add-to-cart GET
router.post('/user/add/cart/:id', userAuth.authMiddleware, cartController.addToCart_post)

// User-cart-change-quantity PUT
router.put('/change/product/quantity', userAuth.authMiddleware, cartController.changeQuantity_put)

// User-cart-remove-item DELETE
router.delete('/delete/cart/item', userAuth.authMiddleware, cartController.removeCarItem_delete)

// User-checkout-page GET
router.get('/user/checkout', userAuth.authMiddleware, cartController.checkout_get)

// Place-order POST
router.post('/place/order', userAuth.authMiddleware, orderController.placeorder_post)

// Order-success GET
router.get('/user/success', userAuth.authMiddleware, orderController.ordersuccess_get)

// Order-details GET
router.get('/user/order/details', userAuth.authMiddleware, orderController.orderdetails_get)

// Order-cancel POST
router.post('/user/order/cancel/:id', userAuth.authMiddleware, orderController.userordercancel_post)

// Order-cancel-single-product POST
router.post('/user/order/cancel/single/:id', userAuth.authMiddleware, orderController.userordersingleproductcancel_post)

// verify-payment POST
router.post('/verify/payment',userAuth.authMiddleware,orderController.verifyPayment)

// user-add-address while checkout
router.post('/user/add/address-checkout',userAuth.authMiddleware,addressController.addaddresscheckout_post)

// user-wallet GET
router.get('/user/wallet',userAuth.authMiddleware,walletController.userwallet_get)

// user-wallet-activate GET
router.post('/user/activate/wallet/:id',userAuth.authMiddleware,walletController.userActivateWallet_get)

// user-return-order POST
router.post('/user/order/return/:id',userAuth.authMiddleware,orderController.userorderreturn_post)

// user-whishlist GET
router.get('/user/wishlist',userAuth.authMiddleware,whishlistController.userwhishlist_get)

// user-whishlist-add POST
router.post('/user/wishlist/add/:id',userAuth.authMiddleware,whishlistController.userwhishlistAdd_post)

// user-whishlist-remove DELETE
router.delete('/user/wishlist/remove/:id',userAuth.authMiddleware,whishlistController.userWhislistRemoveItem_delete)

// user-genarate-refferal-code
router.post('/user/generate/refferalcode/:id',userAuth.authMiddleware,profileController.genarateReffaralCode_post)


module.exports = router