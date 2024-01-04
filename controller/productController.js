const product = require('../model/productmodel')
const brand = require('../model/brandmodel')
const category = require('../model/categorymodel')

// Product GET
const product_get = async (req, res) => {
    try {
        const title = "product"
        var i = 0
        const productData = await product.find()
        res.render('admin-product', { title, i, productData })
    } catch (err) {
        res.status(500).render('500')
        console.log(err)
    }
}

//  Add product GET
const addproduct_get = async (req, res) => {
    try {
        const title = "add product"
        const brandData = await brand.find()
        const categoryData = await category.find()
        res.render('admin-add-product', { title, brandData, categoryData })
    } catch (err) {
        res.status(500).render('500')
        console.log(err)
    }
}

// Add product POST
const addproduct_post = async (req, res) => {
    const { title, brand, category, description, price, color } = req.body;
    const images = req.files;
    console.log(images);

    try {
        const allFileNames = images.map(file => file.filename)
        console.log(allFileNames)
        let obj = [];
        for (let i = 0; i < req.body.variant.size.length; i++) {
            obj.push({
                size: req.body.variant.size[i],
                quantity: req.body.variant.quantity[i],
            });
        }

        const exist_product = await product.findOne({ title: title });

        if (exist_product) {
            res.redirect('/admin/product?message=This product already exists');
        } else {
            const new_product = await product.create({
                title: title,
                brandName: brand,
                categoryName: category,
                description: description,
                mrp: price,
                varient: obj,
                images: allFileNames, 
                productColor: color,
            });

            res.redirect('/admin/product');
        }
    } catch (err) {
        console.log(err);
        res.status(500).render('500')
    }
};

// Disable product POST
const disableproduct_post = async (req, res) => {
    try {
        const id = req.params.id
        const disable = await product.updateOne({ _id: id }, { $set: { status: false } })
        res.redirect('/admin/product?message=Success fully disabled.')
    } catch (err) {
        res.status(500).render('500')
        console.log(err)
    }
}

// Enable product POST
const enableproduct_post = async (req, res) => {
    try {
        const id = req.params.id
        const enable = await product.updateOne({ _id: id }, { $set: { status: true } })
        res.redirect('/admin/product?message=Success fully enabled.')
    } catch (err) {
        res.status(500).render('500')
        console.log(err)
    }
}

// Edit product GET
const editproduct_get = async (req, res) => {
    try {
        const id = req.params.id
        const brandData = await brand.find()
        const categoryData = await category.find()
        const data = await product.findOne({ _id: id })
        const title = "edit product"
        res.render('admin-edit-product', { title, data, brandData, categoryData })
    } catch (err) {
        res.status(500).render('500')
        console.log(err)
    }
}

// Edit product POST
const editproduct_post = async (req, res) => {
    try {
        const id = req.params.id
        const { title, brand, category, description, price, color } = req.body
        const existProduct = await product.findById(id)
        if (!existProduct) {
            return res.status(404).send("Product not found")
        }

        const existImages = existProduct.images
        const updatedImages = []
        let obj = []

        for (let i = 1; i <= 4; i++) {
            const existingImage = existImages[i - 1]
            const newImage = req.files[`newimage${i}`]
            const image = newImage ? newImage[0].filename : existingImage
            updatedImages.push(image)
        }

        for (let i = 0; i < req.body.variant.size.length; i++) {
            obj.push({
                size: req.body.variant.size[i],
                quantity: req.body.variant.quantity[i]
            })
        }

        const result = await product.updateOne(
            { _id: id },
            {
                $set: {
                    title: title,
                    brandName: brand,
                    categoryName: category,
                    description: description,
                    mrp: price,
                    varient: obj,
                    images: updatedImages,
                    productColor: color,

                },
            }
        )

        res.redirect('/admin/product?message=successfully updated your changes')
    } catch (err) {
        res.status(500).render('500')
        console.log(err)
    }

}

// Delete product POST
const deleteproduct_post = async (req, res) => {
   try{
    const id = req.params.id
    const deleteProduct = await product.deleteOne({ _id: id })
    res.redirect('/admin/product')
   }catch(err){
    res.status(500).render('500')
    console.log(err)
   }
}

module.exports = {
    product_get,
    addproduct_get,
    addproduct_post,
    disableproduct_post,
    enableproduct_post,
    editproduct_get,
    editproduct_post,
    deleteproduct_post
}