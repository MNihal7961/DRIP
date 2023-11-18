const express = require('express')
const router = express.Router()
const adminController = require('../controller/adminController')
const auth = require('../middleware/adminAuth')

// Admin-login
router.get('/admin/login', adminController.adminlogin_get)
router.post('/admin/login', adminController.adminlogin_post)

// Admin-home GET
router.get('/admin/home', auth.authMiddleware, adminController.adminhome_get)

// Admin-logout
router.get('/admin/logout', auth.authMiddleware, adminController.adminlogout_get)

// Admin-block
router.post('/admin/block/:id', auth.authMiddleware, adminController.adminblock_post)

// Admin-unblock
router.post('/admin/unblock/:id', auth.authMiddleware, adminController.adminunblock_post)

// Admin-user-management
router.get('/admin/user', auth.authMiddleware, adminController.adminuser_get)

// Admin-product-management
router.get('/admin/product', auth.authMiddleware, adminController.adminproduct_get)

module.exports = router