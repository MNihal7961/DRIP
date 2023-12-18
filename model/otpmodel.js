const mongoose = require('mongoose');
const Schema = mongoose.Schema

// 2-10-23 10:40 AM 
const otp_schema = new Schema({
    email : {
        type : String,
    },
    otp : {
        type : String
    },
    isExpired : {
        type : Boolean,
        default : false
    }
},
{
    timestamps : true
})
const OTP = mongoose.model('OTP',otp_schema);
module.exports = OTP;