const authMiddleware = (req, res, next) => {
    if (req.session.userlogged) {
        next()
    } else if(req.session.userblocked){
        return res.redirect('/?message=you are blocked')
    }
    else {
        return res.redirect('/')
    }
}

module.exports={authMiddleware}