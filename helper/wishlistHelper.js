const {ObjectId}=require('mongodb')
const wishlist=require('../model/wishlistmodel')
const product=require('../model/productmodel')

const addToWishlist=async(userId,proId)=>{
    try{
        const existWishlist=await wishlist.findOne({user:new ObjectId(userId)})
        if(existWishlist){
            const itemsArray = existWishlist.items.map(item => item.toString());
            const productExist = itemsArray.indexOf(new ObjectId(proId).toString()) !== -1;
            if(productExist){
                return false
            }else{
                const update = await wishlist.updateOne(
                    { user: new ObjectId(userId) },
                    { $addToSet: { items: new ObjectId(proId) } }
                )
                return true
            }
        }else{
            const newWishlist = await wishlist.create({
                user: new ObjectId(userId),
                items: [new ObjectId(proId)] 
            })
            return true
        }
    }catch(err){
        console.error(err)
    }
}

const productFromWishlist=async(data)=>{
    try{
        const items=data.items.map(item=>item.toString())
        const products = await product.find({ _id: { $in: items.map(id => new ObjectId(id)) } }).select('title mrp images')
        return products
    }catch(err){
        console.error(err)
    }
}

const removeProductFromWishlist=async(userId,proId)=>{
    try{
        const update = await wishlist.updateOne(
            { user: new ObjectId(userId) },
            { $pull: { items: new ObjectId(proId) } }
        )
        if(update){
            return true
        }
    }catch(err){
        console.error(err)
    }
}

module.exports={
    addToWishlist,
    productFromWishlist,
    removeProductFromWishlist
}