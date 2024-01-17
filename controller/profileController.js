const users = require('../model/usermodel')
const bcrypt = require('bcrypt')
const cart = require('../model/cartmodel')
const{ObjectId}=require('mongodb')
const global = require('../global/globalFunction')

// User-profile GET
const userprofile_get = async (req, res) => {
    try {
        const title = "user-profile"
        const userData = await users.findOne({ email: req.session.email })
        const cartNo = await global.cartCount(userData._id)
        const cartItems = await cart.findOne({ user: userData._id })
        const wishlistNo=await global.wishlistNo(userData._id)
        res.render('user-profile', { title, userData, cartItems, cartNo ,wishlistNo})
    } catch (err) {
        res.status(500).render('500')
        console.log(err)
    }
}

// user-edit-profile GET
const usereditprofile_get = async (req, res) => {
    try {
        const id = req.params.id
        const userData = await users.findOne({ email: req.session.email })
        const cartNo = await global.cartCount(userData._id)
        const title = "edit-profile"
        const cartItems = await cart.findOne({ user: userData._id })
        const wishlistNo=await global.wishlistNo(userData._id)
        res.render('user-edit-profile', { title, id, userData, cartItems, cartNo,wishlistNo })
    } catch (err) {
        res.status(500).render('500')
        console.log(err)
    }
}

// user-edit-profile POST
const usereditprofile_post = async (req, res) => {
   try{
    const { name } = req.body
    const userData = await users.findOne({ email: req.session.email })
    if (name == userData.username) {
        res.redirect('/user/edit/profile:id?message=youenteredpreviousnmae')
    } else {
        const updateprofile = await userData.updateOne({ username: name })
        res.redirect('/user/profile/:id?message=successfullyupdatedprofile')
    }
   }catch(err){
    res.status(500).render('500')
    console.log(err)
   }
}

// user-reset-password GET
const userresetpassword_get = async (req, res) => {
   try{
    const userData = await users.findOne({ email: req.session.email })
    const title = "reset-password"
    const cartItems = await cart.findOne({ user: userData._id })
    const cartNo = await global.cartCount(userData._id)
    const wishlistNo=await global.wishlistNo(userData._id)
    res.render('user-reset-password', { title, userData, cartItems, cartNo ,wishlistNo})
   }catch(err){
    res.status(500).render('500')
    console.log(err)
   }
}

// user-reset-password POST
const userresetpassword_post = async (req, res) => {
    try{
        const userData = await users.findOne({ email: req.session.email })
        const title = "reset-password"
        const { oldpassword, newpassword } = req.body
        const pass_match = await bcrypt.compare(oldpassword, userData.password)
        if (pass_match) {
            new_haspass = await bcrypt.hash(newpassword, 10)
            const updatePassword = await users.updateOne({ username: userData.username }, { $set: { password: new_haspass } })
            res.redirect('/user/profile/:id?message=passwordupdatedsuccess')
        } else {
            res.redirect('/user/reset/password?message=entereddatadoesnotmatch')
        }
    }catch(err){
        res.status(500).render('500')
        console.log(err)
    }
}

// user-photo-upload POST
const editprofileImage = async (req, res) => {
    try {
        if (req.file) {
            const updatedUser = await users.findOneAndUpdate(
                { email: req.session.email },
                { profilePhoto: req.file.filename },
                { new: true }
            )
            if (updatedUser) {
                
                res.status(200).json({ message: "profile photo updated successfully" })
            } else {
                res.status(400).json({ error: "user not found" })
            }
        } else {
            res.status(400).json({ error: "no file was uploaded" })
        }
    } catch (err) {
        console.error('error', err)
        res.status(500).render('500')
    }

} 

// user-generate-refferalcode
const genarateReffaralCode_post=async (req,res)=>{
    try{
        const userData = await users.findOne({ email: req.session.email })
        const id=req.params.id
        const num=Math.floor(100000 + Math.random() * 900000)
        const name=global.randomGenarator(userData.username)
        const email=global.randomGenarator(userData.email)
        const baseRefaralCode="Drip"+num+name+email
        const refaralCode=baseRefaralCode.slice(0, 30).padEnd(30, 'X')
        const update=await users.updateOne({_id:new ObjectId(id)},{$set:{refferalcode:refaralCode}})
        if(update){
            res.json({success:true})
        }
    }catch(err){
        res.status(500).render('500')
        console.error(err)
    }
}

// user-drip-coin-page
const dripCoin_get=async(req,res)=>{
    try{
        const title="drip-coin"
        const userData = await users.findOne({ email: req.session.email })
        const cartNo = await global.cartCount(userData._id)
        const cartItems = await cart.findOne({ user: userData._id })
        const wishlistNo=await global.wishlistNo(userData._id)
        res.render('user-drip-coin',{title,userData,cartNo,cartItems,wishlistNo})
    }catch(err){
        res.status(500).render('500')
        console.error(err)
    }
}

// user-refer-page
const referLearnmore_get=async(req,res)=>{
    try{
        const title="referal"
        const userData = await users.findOne({ email: req.session.email })
        const cartNo = await global.cartCount(userData._id)
        const cartItems = await cart.findOne({ user: userData._id })
        const wishlistNo=await global.wishlistNo(userData._id)
        res.render('user-refer-learnmore',{title,userData,cartNo,cartItems,wishlistNo})
    }catch(err){
        res.status(500).render('500')
        console.error(err)
    }
}

module.exports = {
    userprofile_get,
    usereditprofile_get,
    usereditprofile_post,
    usereditprofile_post,
    userresetpassword_get,
    userresetpassword_post,
    editprofileImage,
    genarateReffaralCode_post,
    dripCoin_get,
    referLearnmore_get
}