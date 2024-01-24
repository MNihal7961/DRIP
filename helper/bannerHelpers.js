const banner = require('../model/bannermodel')

const addBanner = async (name, description, image) => {
    try {
        const result = await banner.create(
            { title: name, description: description, image: image }
        )
        return result
    } catch (err) {
        console.error(err)
    }
}

const removeBanner=async(id)=>{
    try{
        const result=await banner.deleteOne({_id:id})
        return result
    }catch(err){
        console.error(err)
    }
}

module.exports = {
    addBanner,
    removeBanner
}