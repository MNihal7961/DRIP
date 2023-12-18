const mongoose = require('mongoose')
require('dotenv').config()

const payment_schema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    paymentType:{
        type:String,
        required:true
    },
    serverType:{
        type:String,
        required:true
    },
    status:{
        type:Boolean,
        default:true
    }
})

const payment=mongoose.model('payment-method',payment_schema)
module.exports=payment