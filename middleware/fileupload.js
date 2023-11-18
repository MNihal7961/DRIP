const multer=require('multer')

// Setup multer for handling file uploads
const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'public/product-image')
    },
    filename:function(req,file,cb){
        cb(null,file.fieldname+'-'+Date.now()+(file.originalname))
    }
})

module.exports=storage