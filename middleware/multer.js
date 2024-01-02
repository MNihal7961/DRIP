const multer=require('multer')
                    

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads/')
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+'-'+"drip.jpg")
    }
})

const multerUpload=multer({storage:storage})

module.exports={
    multerUpload
}