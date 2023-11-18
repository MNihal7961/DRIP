const users = require('../model/usermodel')

// Admin Datas
const adminData = {
    email: "admin@gmail.com",
    password: "admin"
}

// Adminlogin GET
const adminlogin_get = (req, res) => {
    if (req.session.admin) {
        res.redirect('/admin/home')
    } else {
        const title="adminlogin"
        res.render('admin-login',{title})
    }
}

// Adminhome GET
const adminhome_get=async (req,res)=>{
    const title="adminhome"
    var i = 0
    const blockeduser= await users.find({status:false}).count()
    const unblockuser= await users.find({status:true}).count()
    const userCount = await users.find().count()
    const userData = await users.find().sort({ username: 1, email: 1, password: 1, status: 1 })
    res.render('admin-home',{title,userData,i})
}

// Adminlogin POST
const adminlogin_post = async (req, res) => {
    const { email, password } = req.body
    if (adminData.email === email && adminData.password === password) {
        req.session.email = email
        req.session.password = password
        req.session.admin = true
        res.redirect('/admin/home')
    }else{
        res.redirect('/admin/login')
    }
}

// Adminlogout GET
const adminlogout_get=(req,res)=>{
        res.redirect('/')
        req.session.admin=false
}

// Adminblock POST
const adminblock_post = async (req, res) => {
     const id = req.params.id
     console.log(id);
     const block = await users.updateOne({ _id: id }, { $set: { status: false } })
     return res.redirect('/admin/user')
 }

 // Admin unblock POST
const adminunblock_post = async (req, res) => {
     const id = req.params.id
     console.log(id);
     const unblock = await users.updateOne({ _id: id }, { $set: { status: true } })
     return res.redirect('/admin/user')
 }

 // Admin users GET
const adminuser_get=async (req,res)=>{
    const title="usermanagement"
    var i = 0
    const blockeduser= await users.find({status:false}).count()
    const unblockuser= await users.find({status:true}).count()
    const userCount = await users.find().count()
    const userData = await users.find().sort({ username: 1, email: 1, password: 1, status: 1 })
    res.render('admin-user',{title,userData,i})
 }

 // Admin products GET
 const adminproduct_get=async (req,res)=>{
    res.render('admin-product')
 }


module.exports = {
    adminlogin_get,
    adminlogin_post,
    adminhome_get,
    adminlogout_get,
    adminblock_post,
    adminunblock_post,
    adminuser_get,
    adminproduct_get
}