const global=require('../global/globalFunction')
const banner=require('../model/bannermodel')

const adminBanner_get=async(req,res)=>{
    try{
        const title="Banner"
        res.render('admin-bannar',{title})
    }catch(err){
        console.error(err)
        res.status(500).render('500')
    }
}

module.exports={
    adminBanner_get
}