const users = require('../model/usermodel')
const bcrypt = require('bcrypt')
const brand = require('../model/brandmodel')
const category = require('../model/categorymodel')
const product = require('../model/productmodel')
const cart = require('../model/cartmodel')
const global = require('../global/globalFunction')
const sendOTP = require('../global/emailSender')
const OTPgenerator = require('../global/otpGenerator')

// User-signup GET
const usersignup_get = (req, res) => {
    try {
        const title = "usersignup"
        res.render('user-signup', { title })
    } catch (err) {
        console.log(err)
    }
}

// User-login GET
const userlogin_get = (req, res) => {
    try {
        const title = "userlogin"
        res.render('user-login', { title, message: req.flash('message') })
    } catch (err) {
        console.log(err)
    }
}

// User-login POST
const userlogin_post = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await users.findOne({ email })
        if (!user) {
            req.flash('message', 'Email not found')
            res.redirect('/user/login')
        }
        const pass_match = bcrypt.compare(password, user.password)
        if (pass_match) {
            req.session.userlogged = true
            req.session.email = email
            req.session.user = req.body
            res.redirect('/user/home')
        } else {
            req.flash('message', 'wrong password')
            res.redirect('/user/login')
        }
        if (user.status == false) {
            req.flash('messsage', 'You are blocked')
            res.redirect('/user/login')
        }
    } catch (err) {
        console.log(err)
    }
}

// User-home GET
const userhome_get = async (req, res) => {
    try {
        const title = "userhome"
        const productData = await product.find({ status: true }).limit(4)
        const userData = await users.findOne({ email: req.session.email })
        const cartNo = await global.cartCount(userData._id)
        const productData1 = await product.find({ status: true }).limit(4).skip(4)
        const productData2 = await product.find({ status: true }).limit(4).skip(8)
        res.render('user-home', { title, productData, userData, productData1, productData2, cartNo })
    } catch (err) {
        console.log(err)
    }
}

// User-logout GET
const userlogout_get = (req, res) => {
    try {
        req.flash('message', 'Logout success')
        res.redirect('/')
        req.session.userlogged = false
        req.session.destroy()
    } catch (err) {
        console.log(err)
    }
}

// User-product-details GET
const userproductdetails_GET = async (req, res) => {
    try {
        const id = req.params.id
        const productData = await product.findOne({ _id: id })
        const relateData = await product.find({ brandName: productData.brandName, categoryName: productData.categoryName }).limit(4)
        const userData = await users.findOne({ email: req.session.email })
        const cartNo = await global.cartCount(userData._id)
        const title = "product details"
        res.render('user-product-details', { productData, title, relateData, userData, cartNo })
    } catch (err) {
        console.log(err)
    }
}

// User-black-friday-sale GET
const blackfridaysale_get = async (req, res) => {
    try {
        const title = "userhome"
        const productData = await product.find({ status: true }).limit(16).sort({ title: 1 })
        const userData = await users.findOne({ email: req.session.email })
        const cartItems = await cart.findOne({ user: userData._id })
        const cartNo = await global.cartCount(userData._id)
        res.render('user-black-friday-sale', { title, productData, userData, cartItems, cartNo })
    } catch (err) {
        console.log(err)
    }
}

// USer-OTP-signUp
const otpStore1 = {};
const userSignUpOTP_post = async (req, res) => {
    if (req.session.adminLogged) {
        res.redirect('/admin/home')
    }
    try {
        if (req.session.userLogged) {
            return res.redirect('/user/home');
        } else {
            const { name, email, password } = req.body;
            const existingUser = await users.findOne({ email }, {});
            if (existingUser) {
                req.flash('error', 'This email is already in use!. Please Login!')
                return res.redirect('/user/signup')
            }
            const saltRound = 10;
            const hashedPassword = await bcrypt.hash(password, saltRound)
            req.session.userName = name
            req.session.email = email
            req.session.hashedPassword = hashedPassword

            const generatedOTP = OTPgenerator
            console.log('generatedOTP', generatedOTP)
            const userEmail = email;
            const expirationTime = 5 * 60 * 1000;
            const expirationTimestamp = Date.now() + expirationTime;
            otpStore1[generatedOTP] = expirationTimestamp;
            try {
                await sendOTP(userEmail, generatedOTP);
                res.redirect('/user/otp?message=OTP sent to your email&email=' + encodeURIComponent(email));
            } catch (error) {
                console.error('Error sending OTP:', error);
                return res.status(500).redirect('/user/otp?error= error in sending OTP&email=' + encodeURIComponent(email));
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error', error);
    }
}

const userotp_get = (req, res) => {
    res.render('user-otp',
        {
            message: req.query.message,
            error: req.query.error,
            email: req.query.email
        }
    )
}

const userSignUpOTPValidate_post = async (req, res) => {
    const { otp } = req.body;
    const userEnteredOTP = otp
    console.log('userEnteredOTP', userEnteredOTP);
    if (otpStore1[userEnteredOTP] && otpStore1[userEnteredOTP] > Date.now()) {
        const email = req.session.email
        const createNewuser = await users.create({
            username: req.session.userName,
            email: req.session.email,
            password: req.session.hashedPassword
        })
        req.session.userId = createNewuser._id
        // req.session.destroy()
        // res.session.userLogged=true
        console.log(createNewuser, 'createNewuser')
        console.log(req.session.userId, 'req.session.userId')
        res.redirect('/user/login?success=OTP validated successfully');
    } else {
        res.status(500).redirect('/user/otp?error= Invalid or expired OTP');
    }
}

const userForgottPassword_get = (req, res) => {
    try {
        res.render('user-forgott-password')
    } catch (err) {
        console.log(err)
    }
}

const otpStore2 = {}
const userForgottPassword_post = async (req, res) => {
    try {
        const email = req.body.email
        let emailCheck = await users.findOne({ email: email })
        if (!emailCheck) {
            res.redirect('/user/forgott/password?messsage=No User Found')
        } else {
            const generatedOTP = OTPgenerator
            console.log('generatedOTP', generatedOTP)
            const expirationTime = 5 * 60 * 1000;
            const expirationTimestamp = Date.now() + expirationTime;
            otpStore2[generatedOTP] = expirationTimestamp
            await sendOTP(email, generatedOTP)
            req.session.email = email
            res.render('user-forgott-otp')
        }
    } catch (err) {
        console.log(err)
    }
}

const userforgottOTPvalidate_post = (req, res) => {
    try {
        const { otp } = req.body
        const userEnteredOTP = otp
        if (otpStore2[userEnteredOTP] && otpStore2[userEnteredOTP] > Date.now()) {
            res.render('user-new-password')
        } else {
            res.status(500).redirect('/user/forgott/password?error= Invalid or expired OTP');
        }
    } catch (err) {
        console.log(err)
    }
}

const usernewpassword_post = async (req, res) => {
    try {
        const email = req.session.email
        console.log(email + "////////////")
        const password = req.body.password1
        const hashedPassword = await bcrypt.hash(password, 10)
        const update = await users.updateOne({ email: email }, { $set: { password: hashedPassword } })
        res.redirect('/user/login?message=password changed')
    } catch (err) {
        console.log(err)
    }
}

const resendOtp=async (req,res)=>{
    try{
        console.log("worked")
        const generatedOTP = OTPgenerator
            console.log('resendOTP', generatedOTP)
            const userEmail = req.session.email;
            const expirationTime = 5 * 60 * 1000;
            const expirationTimestamp = Date.now() + expirationTime;
            otpStore1[generatedOTP] = expirationTimestamp
            await sendOTP(userEmail, generatedOTP)
    }catch(err){
        console.log(err)
    }
}

module.exports = {
    usersignup_get,
    userotp_get,
    userlogin_get,
    userlogin_post,
    userhome_get,
    userproductdetails_GET,
    userlogout_get,
    blackfridaysale_get,
    userSignUpOTPValidate_post,
    userSignUpOTP_post,
    userForgottPassword_get,
    userForgottPassword_post,
    userforgottOTPvalidate_post,
    usernewpassword_post,
    resendOtp
}