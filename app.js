//9j3sExTYbVsWdhZc
const express =require("express");
const app=express();
const PORT=process.env.PORT || 5000;
const mongoose = require("mongoose");
const { MONGOURI } = require("./config/keys");

const bodyparser=require("body-parser")
mongoose.connect(MONGOURI,{useNewUrlParser:true,useUnifiedTopology:true})
mongoose.connection.on('error',()=>{
    console.log("error")
})
mongoose.connection.on('connected',()=>{
    console.log("connected successfully")
})

app.use(bodyparser.urlencoded({extended:false}))
app.use(express.json())

app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require("./routes/userProfile"))
if(process.env.NODE_ENV=="production"){
    app.use(express.static('frontend/build'))
    const path =require('path')
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'frontend','build','index.html'))
    })
}
  app.listen(PORT,()=>{
                    console.log(`app running on port ${PORT}`)
                })