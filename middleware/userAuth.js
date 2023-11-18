const authMiddleware = (req, res, next) => {
    if (req.session.auth) {
        // User authenticated
        res.redirect('/user/home')
        next()
    } else {
        return res.redirect('/')
    }
}

module.exports={authMiddleware}