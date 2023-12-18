const users = require('../model/usermodel')
const brand = require('../model/brandmodel')
const category = require('../model/categorymodel')
const product = require('../model/productmodel')
const order = require('../model/ordermodel')
const shipping = require('../model/shippingmodel')
const payment = require('../model/paymentmodel')
const cart = require('../model/cartmodel')
const { ObjectId } = require('mongodb')
const cartHelper = require('../helper/cartHelpers')
const address = require('../model/addressmodel')

const loggedUser = async (email) => {
    try {
        return await users.findOne({ email: email })
    } catch (err) {
        console.log(err)
    }
}

const cartCount = async (userId) => {
    try {
        const cartItems = await cartHelper.getCartProducts(userId)
        return cartItems.length
    } catch (err) {
        console.log(err)
    }
}

const totalAmount = (total, tax) => {
    try {
        return total + tax
    } catch (err) {
        console.log(err)
    }
}

const selectShipping = async (name) => {
    try {
        return await shipping.findOne({ title: name })
    } catch (err) {
        console.log(err)
    }
}

const selectAddress = async (userId, addrId) => {
    try {
        return await address.aggregate([
            { $match: { user: new ObjectId(userId) } },
            { $unwind: '$address' },
            { $match: { 'address._id': new ObjectId(addrId) } }
        ])
    } catch (err) {
        throw err
    }
}

const overallPrice = (summary, charge) => {
    try {
        const sum = parseFloat(summary) + parseFloat(charge)
        return sum
    } catch (err) {
        console.log(err)
    }
}

const selectPayment = async (name) => {
    try {
        return await payment.findOne({ title: name })
    } catch (err) {
        console.log(err)
    }
}

const getUserOrders = async (userId) => {
    try {
        const orderData = await order.aggregate([
            { $match: { user: userId } },
            { $unwind: "$order" },
            {
                $project: {
                    _id: 0,
                    oid: "$order._id",
                    buyerName: "$order.buyerName",
                    sellerName: "$order.sellerName",
                    totalPrice: "$order.totalPrice",
                    paymentMethod: "$order.paymentMethod",
                    paymentStatus: "$order.paymentStatus",
                    totalQuantity: "$order.totalQuantity",
                    shippingMethod: "$order.shippingMethod",
                    orderStatus: "$order.orderStatus",
                    orderedAt: { $dateToString: { format: "%Y-%m-%d", date: "$order.orderedAt" } },
                    productDetails: {
                        $map: {
                            input: "$order.productDetails",
                            as: "product",
                            in: {
                                quantity: "$$product.quantity",
                                size: "$$product.size",
                                _id: "$$product._id",
                                productsName: "$$product.productsName",
                                productsPrice: "$$product.productsPrice",
                                status: "$$product.status",
                                productImage: "$$product.productImage",
                                orderStatus: "$$product.orderStatus"
                            }
                        }
                    }
                }
            },
            { $replaceRoot: { newRoot: "$$ROOT" } }
        ]);
        
        return orderData;
        
    } catch (err) {
        console.log(err);
    }
}

const getProductFromOrder = async (userId) => {
    try {
        const ordersWithProductNames = await order.aggregate([
            { $match: { user: new ObjectId(userId) } },
            { $unwind: "$order" },
            {
                $project: {
                    _id: 0,
                    productName: "$order.productDetails.productsName"
                }
            }
        ])

        const productNames = ordersWithProductNames.map(order => order.productName).flat(Infinity)
        console.log(productNames);
        const products = await product.find({ title: { $in: productNames } })
        return products
    } catch (err) {
        console.log(err)
    }
}

const getProductDetailsFromOrder = async (userId) => {
    try {
        const productDetails = await order.aggregate([
            { $match: { user: userId } },
            { $unwind: "$order" },
            { $replaceRoot: { newRoot: "$order" } },
            { $project: { _id: 0, productDetails: 1 } }
        ])

        return productDetails.map(item => item.productDetails)
    } catch (err) {
        console.log(err);
    }
}

const getAllOrder = async () => {
    try {
        const orderData = await order.aggregate([
            {
                $unwind: "$order"
            },
            {
                $project: {
                    "buyerName": "$order.buyerName",
                    "totalPrice": "$order.totalPrice",
                    "paymentMethod": "$order.paymentMethod",
                    "shippingMethod": "$order.shippingMethod",
                    "orderStatus": "$order.orderStatus",
                    "totalQuantity": { $size: "$order.productDetails" },
                    "orderedAt": {
                        $dateToString: {
                            date: "$order.orderedAt",
                            format: "%d-%b-%Y"
                        }
                    },
                    "_id": "$order._id"
                }
            }
        ]);

        return orderData
    } catch (err) {
        console.log(err);
    }
}

const getAllOrderProduct = async () => {
    try {
        const productDetails = await order.aggregate([
            { $unwind: "$order" },
            { $replaceRoot: { newRoot: "$order" } },
            { $project: { _id: 0, productDetails: 1 } }
        ])

        return productDetails.map(item => item.productDetails)
    } catch (err) {
        console.log(err);
    }
}









module.exports = {
    loggedUser,
    cartCount,
    totalAmount,
    selectShipping,
    selectAddress,
    overallPrice,
    selectPayment,
    getUserOrders,
    getProductFromOrder,
    getProductDetailsFromOrder,
    getAllOrder,
    getAllOrderProduct
}