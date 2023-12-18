const mongoose = require('mongoose')
require('dotenv').config()

const brand_schema= new mongoose.Schema({
    brand:{
        type:String,
        required:true,
    },
    status:{
        type:Boolean,
        default:true 
    }
})

const brand=mongoose.model('brand',brand_schema)

module.exports=brand