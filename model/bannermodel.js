const mongoose = require('mongoose')
require('dotenv').config()

const banner_schema= new mongoose.Schema({  
    title:String,
    description:String,
    image:String
})

const banner=mongoose.model('banner',banner_schema)

module.exports=banner