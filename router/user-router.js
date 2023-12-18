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
// router.post('/user/signup', userController.usersignup_post)
//OTP GET
router.get('/user/otp', userController.userotp_get)

router.post('/user/signup', userController.userSignUpOTP_post)
router.post('/user/otp', userController.userSignUpOTPValidate_post)

router.post('/user/upload/profileImage', upload.single('profileimage'), profileController.editprofileImage)

// Login
router.get('/user/login', userController.userlogin_get)
router.post('/user/login', userController.userlogin_post)

// Logout
router.get('/user/logout', userAuth.authMiddleware, userController.userlogout_get)

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
router.post('/user/order/cancelProduct/:oid/:proid', userAuth.authMiddleware, orderController.userordersingleproductcancel_post)




module.exports = router