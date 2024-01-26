const mongoose = require('mongoose')
require('dotenv').config()


// To connect server to mongoDB
mongoose.connect(process.env.MONGOURL, {
    useNewUrlParser: true,
    useUnifiedTopology: false
}).then(() => {
    console.log(" DB Connected");
}).catch((err) => {
    console.log(err)
})
