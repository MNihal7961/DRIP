const express = require('express')
const router = express.Router()
const userController = require('../controller/userController')
const userAuth = require('../middleware/userAuth')

// DEMO PAGE GET
router.get('/',(req,res)=>{
    const title="home"
    res.render('main',{title})
})
// User-home GET
router.get('/user/home',userAuth.authMiddleware,userController.userhome_get)

// Signup
router.get('/user/signup',userController.usersignup_get)
router.post('/user/signup',   userController.usersignup_post)
 
// Login
router.get('/user/login',userController.userlogin_get)
router.post('/user/login',userController.userlogin_post)

module.exports=router