const global=require('../global/globalFunction')
const bannerHelper=require('../helper/bannerHelpers')

const adminBanner_get=async(req,res)=>{
    try{
        const title="Banner"
        const bannerData=await global.findBanner()
        res.render('admin-bannar',{title,bannerData})
    }catch(err){
        console.error(err)
        res.status(500).render('500')
    }
}

const adminAddBanner_post=async(req,res)=>{
    try{
        const {title,description}=req.body
        console.log(req.file.filename)
        const update=await bannerHelper.addBanner(title,description,req.file.filename)
        res.redirect('/admin/banner?message=success')
    }catch(err){
        console.error(err)
    }
}

module.exports={
    adminBanner_get,
    adminAddBanner_post
}