const mongoose = require('mongoose')
require('dotenv').config()

const product_schema= new mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true
    },
    categoryName:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    mrp:{
        type:Number,
        required:true,
        min:0
    },
    quantity:{
        type:Number,
        required:true,
        min:0
    },
    images:{
        type:[String],
        required:true
    },
    productColor:{
        type:String,
        required:true
    },
    productSize:{
        type:[Number],
        required:true
    }
},{
    timestamps:true
})

const product=mongoose.model('product',product_schema)
module.exports=product