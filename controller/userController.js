const users = require('../model/usermodel')
const bcrypt=require('bcrypt')

// User-signup GET
const usersignup_get = (req, res) => {
    const title = "usersignup"
    res.render('user-signup', { title })
}

// User-signup POST
const usersignup_post = async (req, res) => {
    const { name, email, password } = req.body
    console.log(req.body)
    const exist_user = await users.findOne({ email: email }, {})
    if (exist_user) {
        res.redirect('/user/login?message=please login')
    } else {
        const salt = 10
        const hashpass = await bcrypt.hash(password,salt)
        const new_user = await users.create({
            username: name,
            email: email,
            password: hashpass
        })
        console.log(new_user)
        req.session.username = req.body.name
        req.session.email = req.body.email
        req.session.password = req.body.password
        req.session.auth = true
        const title="userhome"
        res.render('user-home',{title})
    }
}

// User-login GET
const userlogin_get = (req, res) => {
    const title="userlogin"
    res.render('user-login',{title})
}

// User-login POST
const userlogin_post = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await users.findOne({ email })
        if (!user) {
            res.redirect('/user/signup')
        }
        const pass_match = await bcrypt.compare(password, user.password)
        if (pass_match) {
            req.session.name = user.name
            req.session.email = user.email
            req.session.password = password
            req.session.auth = true;
            const title="userhome"
            res.render('user-home',{title})
        }
    } catch (err) {
        res.status(500).send("SERVER ERROR")
    }
}

// User-home GET
const userhome_get = (req, res) => {
    const title="userhome"
    res.render('user-home',{title})
}

module.exports = {
    usersignup_get,
    usersignup_post,
    userlogin_get,
    userlogin_post,
    userhome_get
}