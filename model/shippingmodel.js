const mongoose = require('mongoose')
require('dotenv').config()

const shipping_schema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    partner: {
        type: String,
        required: true
    },
    shippingType: {
        type: String,
        required: true
    },
    charge: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    }
})

const shipping=mongoose.model('shipping',shipping_schema)
module.exports=shipping