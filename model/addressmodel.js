const mongoose = require('mongoose')
require('dotenv').config()

const address_schema = new mongoose.Schema({
    user: mongoose.Types.ObjectId,
    address: [{
        fname: {
            type: String,
            required: true
        },
        lname: {
            type: String,
            required:true
        },
        street: {
            type: String,
            required: true
        },
        buildingName: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        pincode: {
            type: Number,
            required: true
        },
        mobile: {
            type: Number,
            required: true
        },
        email: {
            type: String,
            required: true
        }
    }]
})

const address=mongoose.model('address',address_schema)

module.exports=address