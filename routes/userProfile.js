const mongoose=require("mongoose");
const express=require("express");
const requirelogin=require("../middleware/requirelogin");
const Post = require("../models/post");
const userModel = require("../models/user");
const { findByIdAndUpdate } = require("../models/post");
const router=express.Router();
router.get("/userprofile/:id",requirelogin,(req,res)=>{
    userModel.findOne({_id:req.params.id})
    .select("-password")
    .then(user=>{
        Post.find({postedBy:req.params.id},(err,posts)=>{
           if(!err){
            // console.log(user,posts)
            // console.log(user)
               res.json({user,posts});
           }else{
               console.log(err);
           }
    
        })
        // )
        // .populate("postedBy" ,"_id name")
        // .exec((err,posts)=>{
        //     if(err){
        //         res.status(400).json(err)
        //     }else{
        //         res.json({user,posts})
        //     }
        // })
    }).catch(err=>{
        // console.log(err);
        res.status(400).send("bad Request");
    })
})
router.put("/follow/:id",requirelogin,(req,res)=>{
    userModel.findByIdAndUpdate(req.params.id,{
        $push:{followers:req.user._id}
    },{
        new:true
    }).exec((err,user)=>{
        if(err){
            res.status(400).json({message:"bad request"})
        }else{
            Post.find({postedBy:req.params.id},(err,posts)=>{
                if(err){
                    res.json({message:"post not found"})
                }
                else{
                    userModel.findByIdAndUpdate(req.user._id,{
                        $push:{following:req.params.id}
                    },
                    {
                            new:true
                    },(err,result)=>{
                        if(!err)
                        {res.json({user,posts})}
                    })  

                }
            })
        }
    })
})
router.put("/unfollow/:id",requirelogin,(req,res)=>{
    userModel.findByIdAndUpdate(req.params.id,{
        $pull:{followers:req.user._id}
    },{
        new:true
    }).exec((err,user)=>{
        if(err){
            res.status(400).json({message:"bad request"})
        }else{
            Post.find({postedBy:req.params.id},(err,posts)=>{
                if(err){
                    res.json({message:"post not found"})
                }
                else{
                    userModel.findByIdAndUpdate(req.user._id,{
                        $pull:{following:req.params.id}
                    },
                    {
                            new:true
                    },(err,result)=>{
                        if(!err)
                        {res.json({user,posts})}
                    })  

                }
            })
        }
    })
})
router.put("/updateprofileImage",requirelogin,(req,res)=>{
    console.log("update server")
   userModel.findByIdAndUpdate(req.user._id,
        {$set:{profileImage:req.body.url},
        new:true,
        
    },(err,user)=>{
        // console.log(user)
        if(!err){
            res.json({user})
        }
    })
})


module.exports=router;