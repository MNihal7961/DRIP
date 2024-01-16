const order=require('../model/ordermodel')
const { ObjectId } = require('mongodb')
const Razorpay = require('razorpay')
require('dotenv').config()
const crypto = require('crypto')

const instance = new Razorpay({
    key_id: process.env.KEY_ID,
    key_secret: process.env.KEY_SECRET,
})

const generateRazorPay = async (userId, total) => {
    const ordersDetails = await order.find({ user: new ObjectId(userId) })
    let orders = ordersDetails[0]?.order?.slice()?.reverse()
    let orderId = orders[0]._id
    total = total * 100
    return new Promise((resolve, reject) => {
        try {
            var options = {
                amount: total,
                currency: "INR",
                receipt: "" + orderId
            };
            instance.orders.create(options, function (err, order) {
                console.log(order+"//////")
                resolve(order)
            });
        } catch (err) {
            console.Consolelog(err)
        }
    })
}

const verifyPayment = async (payment, order) => {
    return new Promise((resolve, reject) => {
        try {
            let hmac = crypto.createHmac('sha256', 'rzp_test_b17TxK3brF48ub')
            hmac.update(payment.razorpay_order_i + "|" + payment.razorpay_payment_id)
            hmac = hmac.digest('hex')
            console.log(hmac + "55")
            console.log(payment.razorpay_signature + "55")
            if (hmac === payment.razorpay_signature) {
                resolve()
            } else {
                reject("not match")
            }
        } catch (err) {
            console.log(err)
        }
    })
}

const changePaymentStatus = (userId, orderId) => {
    console.log('orderId=>', orderId);
    return new Promise(async (resolve, reject) => {
        try {
            let orders = await order.find({ user: userId })
            let orderIndex = orders[0].order.findIndex(order => order._id == orderId)
            await order.updateOne(
                {
                    'order._id': new ObjectId(orderId)
                },
                {
                    $set: {
                        ['order.' + orderIndex + '.paymentStatus']: 'PAID'
                    }
                }
            ).then((data) => {
                resolve()
            })
        } catch (err) {
            console.log(err)
        }

    })
}

module.exports={
    generateRazorPay,
    verifyPayment,
    changePaymentStatus
}