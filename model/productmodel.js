const mongoose = require('mongoose')
require('dotenv').config()

const product_schema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    brandName: {
        type: String,
        required: true,
    },
    categoryName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    mrp: {
        type: Number,
        required: true,
        min: 0
    },
    varient: [
        {
            size: {
                type: Number,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ],
    images: {
        type: [String],
        required: true
    },
    productColor: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
})

const product = mongoose.model('product', product_schema)
module.exports = product