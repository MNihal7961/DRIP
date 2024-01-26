const product=require('../model/productmodel')
const offerHelper=require('../helper/offerHelpers')

const adminProductOffers_get=async(req,res)=>{
    try{
        const title="Admin-product-offers"
        const productData=await offerHelper.getProductDetails()
        var i=0
        res.render('admin-product-offers',{title,productData,i})
    }catch(err){
        res.status(500).render('500')
        console.error(err)
    }
}

const adminAddOffers_post=async(req,res)=>{
    try{
        const id=req.params.id
        const price=req.body.discountPrice
        const result= await offerHelper.addProductOffer(id,price)
        if(result){
            res.redirect('/admin/product/offer?message=success')
        }
    }catch(err){
        res.status(500).rendeer('500')
        console.error(err)
    }
}

const adminEditOffers_post=async(req,res)=>{
    try{
        const id=req.params.id
        const price=req.body.editDiscountPrice
        const result=await offerHelper.editProductOffer(id,price)
        if(result){
            res.redirect('/admin/product/offer?message=success')
        }
    }catch(err){
        res.status(500).rendeer('500')
        console.error(err)
    }
}

const adminDeleteOffers_delete=async(req,res)=>{
    try{
        const id=req.params.id
        const price=req.body.discountprice
        const result=await offerHelper.removeProductOffer(id,price)
        if (result == true) {
            res.json({ success :true});
        }

    }catch(err){
        res.status(500).render('500')
        console.error(err)
    }
}

const adminCategoryOffers_get=async(req,res)=>{
    try{
        const title="admin-category-offer"
        const categoryData=await offerHelper.getCategoryDetails()
        var i=0
        res.render('admin-category-offer',{title,categoryData,i})
    }catch(err){
        res.status(500).render('500')
        console.error(err)
    }
}

const adminAddCategoryOffers_post=async(req,res)=>{
    try{
        const id=req.params.id
        const price=req.body.discountPrice
        const result= await offerHelper.addCategoryOffer(id,price)
        if(result){
            res.redirect('/admin/category/offer?message=success')
        }
    }catch(err){
        res.status(500).render('500')
        console.error(err)
    }
}

const adminEditCategoryOffers_post=async(req,res)=>{
    try{
        const id=req.params.id
        const price=req.body.editDiscountPrice
        const result=await offerHelper.editCategoryOffer(id,price)
        if(result){
            res.redirect('/admin/category/offer?message=success')
        }
    }catch(err){
        res.status(500).render('500')
        console.error(err)
    }
}

const adminDeleteAddCategoryOffers_delete=async(req,res)=>{
    try{
        const id=req.params.id
        console.log(req.body)
        const price=req.body.discountprice
        const result=await offerHelper.removeCategoryOffer(id,price)

        if (result == true) {
            res.json({ success :true});
        }

    }catch(err){
        res.status(500).render('500')
        console.error(err)
    }
}

module.exports={
    adminProductOffers_get,
    adminAddOffers_post,
    adminEditOffers_post,
    adminDeleteOffers_delete,
    adminCategoryOffers_get,
    adminAddCategoryOffers_post,
    adminEditCategoryOffers_post,
    adminDeleteAddCategoryOffers_delete
}