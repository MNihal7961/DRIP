const authMiddleware = (req, res, next) => {
    if (req.session.adminlogged) {
      // Admin is authenticated
      next();
    } else {
      // Admin is not authenticated, redirect to login page
      res.redirect('/admin/login');
    }
  };
  
module.exports = {authMiddleware};