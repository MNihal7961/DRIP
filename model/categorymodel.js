const mongoose = require('mongoose')
require('dotenv').config()

const category_schema= new mongoose.Schema({
    category:{
        type:String,
        required:true,
        unique:true
    },
    createdDate:{
        type:Date,
        default:Date.now
    },
    status:{
        type:Boolean,
        default:true
    }
})

const category=mongoose.model('category',category_schema)

module.exports=category