const shipping = require('../model/shippingmodel')

// Shipping GET
const shipping_get = async (req, res) => {
    try {
        const title = "shipping"
        var i = 0
        const shippingData = await shipping.find()
        res.render('admin-shipping', { title, i, shippingData })
    } catch (err) {
        res.status(500).render('500')
        console.log(err)
    }
}

// Add shipping GET
const addshipping_get = (req, res) => {
    try {
        const title = 'Add shipping'
        res.render('admin-add-shipping', { title })
    } catch (err) {
        res.status(500).render('500')
        console.log(err)
    }
}

// Add shipping POST
const addshipping_post = async (req, res) => {
    const { name, partner, type, charge } = req.body
    const existShipping = await shipping.findOne({ title: name })
    try {
        if (existShipping) {
            res.redirect('/admin/add/shipping?message=This shipping already exist')
        } else {
            const new_shipping = await shipping.create({
                title: name,
                partner: partner,
                shippingType: type,
                charge: parseInt(charge)
            })
            res.redirect('/admin/shipping?message=Successfully added new shipping')
        }
    } catch (err) {
        res.status(500).render('500')
        console.log(err)
    }
}

// Disable shipping POST
const disableshipping_post = async (req, res) => {
    const id = req.params.id
    try {
        const disable = await shipping.updateOne({ _id: id }, { $set: { status: false } })
        res.redirect('/admin/shipping?message=disabled')
    } catch (err) {
        res.status(500).render('500')
        console.log(err)
    }
}

// Enable shipping POST
const enableshipping_post = async (req, res) => {
    const id = req.params.id
    try {
        const enable = await shipping.updateOne({ _id: id }, { $set: { status: true } })
        res.redirect('/admin/shipping?message=enabled')
    } catch (err) {
        res.status(500).render('500')
        console.log(err)
    }
}

// Edit shipping GET
const editshipping_get = async (req, res) => {
    try {
        const id = req.params.id
        const data = await shipping.findOne({ _id: id })
        const title = "edit shipping"
        res.render('admin-edit-shipping', { title, data })
    } catch (err) {
        res.status(500).render('500')
        consol.log(err)
    }
}

// Edit shipping POST
const editshipping_post = async (req, res) => {
    const { name, partner, type, charge } = req.body
    const existShipping = await shipping.findOne({ title: name })
    try {
        if (existShipping) {
            res.redirect('/admin/add/shipping?message=This shipping already exist')
        } else {
            const new_shipping = await shipping.updateOne({
                title: name,
                partner: partner,
                shippingType: type,
                charge: parseInt(charge)
            })
            res.redirect('/admin/shipping?message=Successfully added new shipping')
        }
    } catch (err) {
        res.status(500).render('500')
        console.log(err)
    }
}

// Delete shipping POST
const deleteshipping_post = async (req, res) => {
    const id = req.params.id
    try {
        const deleteShipping = await shipping.deleteOne({ _id: id })
        res.redirect('/admin/shipping')
    } catch (err) {
        res.status(500).render('500')
        console.log(err)
    }
}
module.exports = {
    shipping_get,
    addshipping_get,
    addshipping_post,
    disableshipping_post,
    enableshipping_post,
    editshipping_get,
    editshipping_post,
    deleteshipping_post
}