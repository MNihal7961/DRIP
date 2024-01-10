const mongoose = require('mongoose')
require('dotenv').config()

// Wishlist Schema
const wishlist_schema= new mongoose.Schema({
    user:mongoose.Types.ObjectId,
    items:[mongoose.Types.ObjectId]
})

const wishlist=mongoose.model("wishlist",wishlist_schema)

module.exports=wishlist
