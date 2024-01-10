const users = require('../model/usermodel')
const product = require('../model/productmodel')
const cart = require('../model/cartmodel')
const { ObjectId } = require('mongodb')
const cartHelper = require('../helper/cartHelpers')
const global = require('../global/globalFunction')
const address = require('../model/addressmodel')
const shipping = require('../model/shippingmodel')
const payment = require('../model/paymentmodel')


const cart_get = async (req, res) => {
    try {
        const userData = await global.loggedUser(req.session.email)
        const userCart = await cart.findOne({ user: new ObjectId(userData._id) })
        const cartItems = await cartHelper.getCartProducts(userData._id)
        const cartNo = await global.cartCount(userData._id)
        const relateData = await product.find({ status: true }).sort({ title: 1 }).limit(4)
        const title = "cart"
        const wishlistNo=await global.wishlistNo(userData._id)
        if (cartItems.length > 0) {
            const total = await cartHelper.getTotalAmount(userData._id)
            var i = 0
            const eachTotal = await cartHelper.getTotalAmountOfEachItem(userData._id)
            const tax = Math.round(((total * 18) / 100))
            const summary = global.totalAmount(total, tax)
            res.render('user-cart', {wishlistNo, title, cartItems, userData, relateData, userCart, total, eachTotal, i, tax, cartNo, summary })
        } else {
            res.render('user-cart', {wishlistNo, title, cartItems, userData, relateData, userCart, cartNo })
        }
    } catch (err) {
        res.status(500).render('500')
        console.log(err)
    }

}

const addToCart_post = async (req, res) => {
    try {
        const productId = req.params.id
        const size = req.body.size
        const userData = await users.findOne({ email: req.session.email })
        cartHelper.addToCart(productId, userData._id, parseInt(size)).then(() => {
            res.redirect('/user/cart')
        })
    } catch (err) {
        res.status(500).render('500')
        console.log(err)
    }
}

const changeQuantity_put = async (req, res) => {
    try {
        const userData = await users.findOne({ email: req.session.email })
        console.log(req.body)
        cartHelper.changeProductQuantity(req.body).then((response) => {
            res.json(response)
        })
    } catch (err) {
        res.status(500).render('500')
        console.log(err)
    }
}

const removeCarItem_delete = async (req, res) => {
    try {
        const userData = await users.findOne({ email: req.session.email })
        cartHelper.deleteCartItem(req.body).then((response) => {
            res.json(response)
        })
    } catch (err) {
        res.status(500).render('500')
        console.log(err)
    }
}

const checkout_get = async (req, res) => {
    const userData = await global.loggedUser(req.session.email)
    const cartItems = await cartHelper.getCartProducts(userData._id)
    const wishlistNo=await global.wishlistNo(userData._id)
    try {
        if (cartItems.length > 0) {
            const userCart = await cart.findOne({ user: new ObjectId(userData._id) })
            const cartNo = await global.cartCount(userData._id)
            const title = "checkout"
            const total = await cartHelper.getTotalAmount(userData._id)
            const eachTotal = await cartHelper.getTotalAmountOfEachItem(userData._id)
            const tax = (total * 18) / 100
            const summary = global.totalAmount(total, tax)
            const shippingData = await shipping.find({ status: true })
            const addressData = await address.findOne({ user: userData._id })
            const paymentData = await payment.find({ status: true })
            var i = 0
            res.render('user-checkout', {wishlistNo, i, title, cartItems, userData, userCart, total, eachTotal, cartNo, summary, shippingData, addressData, paymentData })
        }
    } catch (err) {
        res.status(500).render('500')
        console.log(err)
    }
}




module.exports = {
    cart_get,
    addToCart_post,
    changeQuantity_put,
    removeCarItem_delete,
    checkout_get,
}