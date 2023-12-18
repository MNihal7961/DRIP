const authMiddleware = (req, res, next) => {
    if (req.session.userlogged) {
        // User authenticated
        next()
    } else {
        return res.redirect('/')
    }
}

module.exports={authMiddleware}