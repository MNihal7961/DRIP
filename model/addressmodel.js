const mongoose = require('mongoose')
require('dotenv').config()

const address_schema = new mongoose.Schema({
    user: mongoose.Types.ObjectId,
    address: [{
        fname: {
            type: String
        },
        lname: {
            type: String
        },
        street: {
            type: String
        },
        buildingName: {
            type: String
        },
        city: {
            type: String
        },
        state: {
            type: String
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