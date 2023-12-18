const nodemailer = require('nodemailer')
require('dotenv').config()

const sendOTP = async (userEmail, otp) => {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD
        }
    })

    // Email-Content
    const mailOptions = {
        from: process.env.MAIL_USER,
        to: userEmail,
        subject: 'OTP for Drip-Store sign-up',
        text: `Your OTP is:${otp}`
    }

    await transporter.sendMail(mailOptions)
}

module.exports = sendOTP


