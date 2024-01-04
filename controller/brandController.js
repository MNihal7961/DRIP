const brand = require('../model/brandmodel')

// Brand GET
const brand_get = async (req, res) => {
    try {
        const title = "brands"
        var i = 0
        const brandData = await brand.find().sort({ brand: 1, createdDate: 1, status: 1 })
        res.render('admin-brand', { title, i, brandData })
    } catch (err) {
        res.status(500).render('500')
        console.log(err)
    }
}

//  Add brand GET
const addbrand_get = (req, res) => {
    try {
        const title = "Add Brand"
        res.render('admin-add-brand', { title })
    } catch (err) {
        res.status(500).render('500')
        console.log(err)
    }
}

// Add brand POST
const addbrand_post = async (req, res) => {
    try {
        const brandName = req.body.brand
        const exist_brand = await brand.findOne({ brand: brandName })
        if (exist_brand) {
            res.redirect('/admin/add/brand?message=This brand already exist')
        } else {
            const new_brand = await brand.create({ brand: brandName })
            res.redirect('/admin/brand?message=Successfully added new brand')
        }
    } catch (err) {
        res.status(500).render('500')
        console.log(err)
    }
}

// Disable brand POST
const disablebrand_post = async (req, res) => {
    try {
        const id = req.params.id
        const disable = await brand.updateOne({ _id: id }, { $set: { status: false } })
        res.redirect('/admin/brand?message=Success fully disabled.')
    } catch (err) {
        res.status(500).render('500')
        console.log(err)
    }
}

// Enable brand POST
const enablebrand_post = async (req, res) => {
    try {
        const id = req.params.id
        const enable = await brand.updateOne({ _id: id }, { $set: { status: true } })
        res.redirect('/admin/brand?message=Success fully enabled.')
    } catch (err) {
        res.status(500).render('500')
        console.log(err)
    }
}

// Edit brand GET
const editbrand_get = async (req, res) => {
    try {
        const id = req.params.id
        const data = await brand.findOne({ _id: id })
        const title = "edit brand"
        res.render('admin-edit-brand', { title, data })
    } catch (err) {
        res.status(500).render('500')
        console.log(err)
    }
}

// Edit brand POST
const editbrand_post = async (req, res) => {
    try {
        const id = req.params.id
        const newName = req.body.brand
        const edit = await brand.updateOne({ _id: id }, { $set: { brand: newName } })
        res.redirect('/admin/brand?message="Successfully edited your changes"')
    } catch (err) {
        res.status(500).render('500')
        console.log(err)
    }
}

// Delete brand POST
const deletebrand_post = async (req, res) => {
    try {
        const id = req.params.id
        const deleteBrand = await brand.deleteOne({ _id: id })
        res.redirect('/admin/brand')
    } catch (err) {
        res.status(500).render('500')
        console.log(err)
    }
}
module.exports = {
    brand_get,
    addbrand_get,
    addbrand_post,
    disablebrand_post,
    enablebrand_post,
    editbrand_get,
    editbrand_post,
    deletebrand_post
}