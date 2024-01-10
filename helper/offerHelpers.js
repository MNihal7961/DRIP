const product=require('../model/productmodel')
const category=require('../model/categorymodel')
const{ObjectId}=require('mongodb')

const getProductDetails=async()=>{
    try{
        const result = await product.aggregate([
            {
                $match:{status:true}
            },
            {
                $project: {
                    images: 1,
                    title: 1,
                    mrp: 1,
                    discountprice:1,
                    sellingprice:1,
                    categorydiscount:1
                }
            }
        ])
        return result
    }catch(err){
        console.error(err)
    }
}

const addProductOffer=async(proId,price)=>{
    try{
        const sellingprice = await product.findById(proId).select('sellingprice').lean();
        const productcategory=await product.findOne({_id:new ObjectId(proId)})
        if (sellingprice) {
            let discount=parseInt(price)+productcategory.categorydiscount
           const newSellingPrice = productcategory.sellingprice - discount
        
          const result = await product.updateOne(
            { _id: new ObjectId(proId) },
            {
              $set: {
                discountprice: parseInt(price),
                sellingprice: newSellingPrice
              }
            }
          )

          if(result){
            return true
          }else{
            return false
          }
        }
       
    }catch(err){
        console.error(err)
    }
}

const editProductOffer=async(proId,price)=>{
    try{
        const mrp = await product.findById(proId).select('mrp').lean();

        if (mrp) {
          const newSellingPrice = mrp.mrp - parseInt(price);
        
          const result = await product.updateOne(
            { _id: new ObjectId(proId) },
            {
              $set: {
                discountprice: parseInt(price),
                sellingprice: newSellingPrice
              }
            }
          )

          if(result){
            return true
          }else{
            return false
          }
        }
    }catch(err){
        console.error(err)
    }
}

const removeProductOffer=async(id,price)=>{
    try{
        const result=await product.updateOne(
            {_id:new ObjectId(id)},
            {
                $set:{discountprice:0},
                $inc:{sellingprice:parseInt(price)}
            }
        )
        if(result){
            return true
        }
    }catch(err){
        console.error(err)
    }
}

const getCategoryDetails=async ()=>{
    try{
        const result=await category.aggregate([
            {
                $match:{status:true}
            },
            {
                $project:{
                    category:1,
                    discountprice:1
                }
            }
        ])

        return result
    }catch(err){
        console.error(err)
    }
}

const addCategoryOffer=async (catId,price)=>{
    try{
        const productCategory=await category.findOne({_id:new ObjectId(catId)})
        const result=await category.updateOne({_id:new ObjectId(catId)},{$set:{discountprice:parseInt(price)}})
        const updateProduct=await product.updateMany(
            { categoryName: productCategory.category },
            {
                $set: { categorydiscount: parseInt(price) },
                $inc: { sellingprice: -parseInt(price) },
            }
          )
        if(result&&updateProduct){
            return true
          }else{
            return false
        }

    }catch(err){
        console.error(err)
    }
}

const editCategoryOffer=async (catId,price)=>{
    try{
        const productCategory=await category.findOne({_id:new ObjectId(catId)})
        const result=await category.updateOne({_id:new ObjectId(catId)},{$set:{discountprice:parseInt(price)}})
        const updateProduct=await product.updateMany(
            { categoryName: productCategory.category },
            {
                $set: { categorydiscount: parseInt(price) },
                $inc: { sellingprice: -parseInt(price) },
            }
          )

        if(result&&updateProduct){
            return true
          }else{
            return false
        }

    }catch(err){
        console.error(err)
    }
}

const removeCategoryOffer=async (id,price)=>{
    try{
        const productCategory=await category.findOne({_id:new ObjectId(id)})
        const result=await category.updateOne({_id:new ObjectId(id)},{$set:{discountprice:0}})
        const updateProduct=await product.updateMany(
            { categoryName: productCategory.category },
            {
                $set: { categorydiscount: 0 },
                $inc:{sellingprice:parseInt(price)}
            }
        )

        if(result&&updateProduct){
            return true
        }
    }catch(err){
        console.error(err)
    }
}

module.exports={
    getProductDetails,
    addProductOffer,
    editProductOffer,
    removeProductOffer,
    getCategoryDetails,
    addCategoryOffer,
    editCategoryOffer,
    removeCategoryOffer
}