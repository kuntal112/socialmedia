const jwt=require('jsonwebtoken');
const {SECRET_KEY}=require('../config/keys')
const userModel = require('../models/user');
module.exports=(req,res,next)=>{
    const {authorization} = req.headers;
    // console.log(req.headers)
    if(!authorization){
        return res.json({error:"you must login first"});

    }
    const token=authorization.replace("bearer ","");
    jwt.verify(token,SECRET_KEY,(err,payload)=>{
        if(err){
            res.json({error:"you must login first"});

        }else{
            const {_id}=payload;
            userModel.findById(_id).then(userdata=>{  
                req.user=userdata;
                next()
            })
        }
       
    })


}