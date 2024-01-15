const express = require('express')
const router = express.Router()
const auth = require('../middleware/adminAuth')
const adminController = require('../controller/adminController')
const categoryController = require('../controller/categoryController')
const brandController = require('../controller//brandController')
const productController = require('../controller/productController')
const upload = require('../middleware/multer')
const shippingController = require('../controller/shippingController')
const paymentController = require('../controller/paymentController')
const orderController = require('../controller/orderController')
const salesController = require('../controller/salesController.js')
const offerController=require('../controller/offerController')

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

// Admin-category-management
router.get('/admin/category', auth.authMiddleware, categoryController.category_get)

// Admin-add-category
router.get('/admin/add/category', auth.authMiddleware, categoryController.addcategory_get)
router.post('/admin/add/category', auth.authMiddleware, categoryController.addcategory_post)

/// Admin-disable-category
router.post('/admin/category/disable/:id', auth.authMiddleware, categoryController.disablecategory_post)

// Admin-enable-category
router.post('/admin/category/enable/:id', auth.authMiddleware, categoryController.enablecategory_post)

// Admin-delete-category
router.post('/admin/category/delete/:id', auth.authMiddleware, categoryController.deletecategory_post)

// Admin-edit-category
router.get('/admin/edit/category/:id', auth.authMiddleware, categoryController.editcategory_get)
router.post('/admin/edit/category/:id', auth.authMiddleware, categoryController.editcategory_post)

// Admin-brand-mangement
router.get('/admin/brand', auth.authMiddleware, brandController.brand_get)

// Admin-add-brand
router.get('/admin/add/brand', auth.authMiddleware, brandController.addbrand_get)
router.post('/admin/add/brand', auth.authMiddleware, brandController.addbrand_post)

// Admin-disable-brand
router.post('/admin/brand/disable/:id', auth.authMiddleware, brandController.disablebrand_post)

// Admin-enable-brand
router.post('/admin/brand/enable/:id', auth.authMiddleware, brandController.enablebrand_post)

// Admin-edit-brand
router.get('/admin/edit/brand/:id', auth.authMiddleware, brandController.editbrand_get)
router.post('/admin/edit/brand/:id', auth.authMiddleware, brandController.editbrand_post)

// Admin-delete-brand
router.post('/admin/delete/brand/:id', auth.authMiddleware, brandController.deletebrand_post)

// Admin-product-management
router.get('/admin/product', auth.authMiddleware, productController.product_get)

// Admin-add-product
router.get('/admin/add/product', auth.authMiddleware, productController.addproduct_get)
router.post(
    '/admin/add/product',
    auth.authMiddleware,
    upload.multerUpload.array('images',4),
    productController.addproduct_post
);


// Admin-disable-product
router.post('/admin/product/disable/:id', auth.authMiddleware, productController.disableproduct_post)

// Admin-enable-product
router.post('/admin/product/enable/:id', auth.authMiddleware, productController.enableproduct_post)

// Admin-edit-product
router.get('/admin/edit/product/:id', auth.authMiddleware, productController.editproduct_get)
router.post('/admin/edit/product/:id',
    auth.authMiddleware,
    upload.multerUpload.fields([
        { name: 'newimage1', maxCount: 1 },
        { name: 'newimage2', maxCount: 1 },
        { name: 'newimage3', maxCount: 1 },
        { name: 'newimage4', maxCount: 1 },
    ]),
    productController.editproduct_post
)

// Admin-delete-product
router.post('/admin/product/delete/:id', auth.authMiddleware, productController.deleteproduct_post)

// Admin-shipping
router.get('/admin/shipping', auth.authMiddleware, shippingController.shipping_get)

// Admin-add-shipping
router.get('/admin/add/shipping', auth.authMiddleware, shippingController.addshipping_get)
router.post('/admin/add/shipping', auth.authMiddleware, shippingController.addshipping_post)


// Admin-disable-shipping
router.post('/admin/shipping/disable/:id', auth.authMiddleware, shippingController.disableshipping_post)

// Admin-enable-shipping
router.post('/admin/shipping/enable/:id', auth.authMiddleware, shippingController.enableshipping_post)

// Admin-edit-shipping
router.get('/admin/edit/shipping/:id', auth.authMiddleware, shippingController.editshipping_get)
router.post('/admin/edit/shipping/:id', auth.authMiddleware, shippingController.editshipping_post)

// Admin-delete-shipping
router.post('/admin/delete/shipping/:id', auth.authMiddleware, shippingController.deleteshipping_post)

// Admin-payment
router.get('/admin/payment', auth.authMiddleware, paymentController.payment_get)

// Admin-add-payment
router.get('/admin/add/payment', auth.authMiddleware, paymentController.addpayment_get)
router.post('/admin/add/payment', auth.authMiddleware, paymentController.addpayment_post)

// Admin-disable-payment
router.post('/admin/payment/disable/:id', auth.authMiddleware, paymentController.disablepayment_post)

// Admin-enable-payment
router.post('/admin/payment/enable/:id', auth.authMiddleware, paymentController.enablepayment_post)

// Admin-edit-shipping
router.get('/admin/edit/payment/:id', auth.authMiddleware, paymentController.editpayment_get)
router.post('/admin/edit/payment/:id', auth.authMiddleware, paymentController.editpayment_post)

// Admin-delete-shipping
router.post('/admin/delete/payment/:id', auth.authMiddleware, paymentController.deletpayment_post)

// Admin-order
router.get('/admin/order', auth.authMiddleware, orderController.adminorder_get)

// Admin-order-process
router.post('/admin/order/process/:id', auth.authMiddleware, orderController.adminorderprocess_post)

// Admin-order-place
router.post('/admin/order/place/:id', auth.authMiddleware, orderController.adminorderplaced_post)

// Admin-order-ship
router.post('/admin/order/ship/:id', auth.authMiddleware, orderController.adminordershipped_post)

// Admin-order-delivery
router.post('/admin/order/delivery/:id', auth.authMiddleware, orderController.adminorderdelivered_post)

// Admin-order-returns
router.get('/admin/return/requests',auth.authMiddleware,orderController.adminReturnRequests_get)

// Admin-sales-report
router.get('/admin/sales/report', auth.authMiddleware, salesController.adminsalesreport_get)

// Admin-product-offer
router.get('/admin/product/offer',auth.authMiddleware,offerController.adminProductOffers_get)

// Admin-add-product-offer
router.post('/admin/add/product/offer/:id',auth.authMiddleware,offerController.adminAddOffers_post)

// Admin-edit-product-offer
router.post('/admin/edit/product/offer/:id',auth.authMiddleware,offerController.adminEditOffers_post)

// Admin-delete-product-offer
router.delete('/admin/delete/product/offer/:id',auth.authMiddleware,offerController.adminDeleteOffers_delete)

// Admin-category-offer
router.get('/admin/category/offer',auth.authMiddleware,offerController.adminCategoryOffers_get)

// Admin-add-category-offer
router.post('/admin/add/category/offer/:id',auth.authMiddleware,offerController.adminAddCategoryOffers_post)

// Admin-edit-category-offer
router.post('/admin/edit/category/offer/:id',auth.authMiddleware,offerController.adminEditCategoryOffers_post)

// Admin-delete-category-offer
router.delete('/admin/delete/category/offer/:id',auth.authMiddleware,offerController.adminDeleteAddCategoryOffers_delete)

// Admin-cancelled-order 
router.get('/admin/cancelled/orders',auth.authMiddleware,orderController.adminCancelorders_get)

// Admin-returned-order
router.get('/admin/returned/orders',auth.authMiddleware,orderController.adminReturnedOrders_get)

// Admin-delivered-order
router.get('/admin/delivered/orders',auth.authMiddleware,orderController.adminDeliveredOrders_get)

// Admin-confirm-return-order
router.post('/admin/order/return/approve/:id',auth.authMiddleware,orderController.adminReturnOrderConfirm_post)

module.exports = router

