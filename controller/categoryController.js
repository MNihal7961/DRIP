const category = require('../model/categorymodel')

// Category GET
const category_get = async (req, res) => {
    try {
        const title = "category"
        var i = 0
        const categoryData = await category.find().sort({ category: 1, createdDate: 1, status: 1 })
        res.render('admin-category', { title, i, categoryData })
    } catch (err) {
        res.status(500).render('500')
        console.log(err)
    }
}

// Add category GET
const addcategory_get = (req, res) => {
    try {
        const title = "add category"
        res.render('admin-add-category', { title })
    } catch (err) {
        res.status(500).render('500')
        console.log(err)
    }
}

// Add category POST
const addcategory_post = async (req, res) => {
    try {
        const category_name = req.body.category

        const exist_category = await category.findOne({ category: category_name })

        if (exist_category) {
            res.redirect('/admin/addcategory?message=This category already exist')
        } else {
            const new_category = await category.create({ category: category_name })
            console.log(new_category)
            res.redirect('/admin/category?message=Success fully adeed.')
        }
    } catch (err) {
        res.status(500).render('500')
        console.log(err)
    }
}

// Disable category POST
const disablecategory_post = async (req, res) => {
    try {
        const id = req.params.id
        const disable = await category.updateOne({ _id: id }, { $set: { status: false } })
        res.redirect('/admin/category?message=Success fully disabled.')
    } catch (err) {
        res.status(500).render('500')
        console.log(err)
    }
}

// Enable category POST
const enablecategory_post = async (req, res) => {
    try {
        const id = req.params.id
        const enable = await category.updateOne({ _id: id }, { $set: { status: true } })
        res.redirect('/admin/category?message=Success fully enabled.')
    } catch (err) {
        res.status(500).render('500')
        console.log(err)
    }
}

// Delete category POST
const deletecategory_post = async (req, res) => {
    try {
        const id = req.params.id
        const deleteCategory = await category.deleteOne({ _id: id })
        res.redirect('/admin/category')
    } catch (err) {
        res.status(500).render('500')
        console.log(err)
    }
}

// Edit category GET
const editcategory_get = async (req, res) => {
    try {
        const id = req.params.id
        const data = await category.findOne({ _id: id })
        const title = "edit category"
        res.render('admin-edit-category', { title, data })
    } catch (err) {
        res.status(500).render('500')
        console.log(err)
    }
}

// Edit category POST
const editcategory_post = async (req, res) => {
   try{
    const id = req.params.id
    const newName = req.body.category
    const edit = await category.updateOne({ _id: id }, { $set: { category: newName } })
    res.redirect('/admin/category?message="Successfully edited your changes"')
   }catch(err){
    res.status(500).render('500')
    console.log(err)
   }
}


module.exports = {
    category_get,
    addcategory_get,
    addcategory_post,
    disablecategory_post,
    enablecategory_post,
    deletecategory_post,
    editcategory_get,
    editcategory_post
}