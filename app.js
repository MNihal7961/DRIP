const express=require('express')
const bodyparser=require('body-parser')
require('dotenv').config()
const path=require('path')
const uuid=require('uuid')
const users=require('./model/usermodel')
const userRouter=require('./router/user-router')
const adminRouter=require('./router/admin-router')
const session = require('express-session')
const nocache = require('nocache')
const connectDB=require('./config/connection')
const storage=require('./middleware/multer')
const flash=require('connect-flash')
const userController=require('../Project/controller/userController')


const PORT=process.env.PORT||3000
const HOST=process.env.HOST
const app=express()
const key=uuid.v4()

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: true }))
app.use(express.json())
app.use(flash())

app.set('view engine','ejs')
app.set("views", path.join(__dirname, "views"))

app.use(express.static("public"))
app.use(express.static("uploads"))

app.use(session({
  secret:key,
  resave:false,
  saveUninitialized:true
}))

  
app.use((req,res,next)=>{
  res.set('Cache-Control',
  'no-cache,private,no-store,must-revalidate')
  next();
})

app.use("/", adminRouter)
app.use("/",userRouter)

// 404 
app.all('*',userController.errorPage)

app.listen(PORT, () => { console.log(`Listening on ${HOST}:${PORT}`) })

module.exports = app