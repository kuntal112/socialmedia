const express=require('express');
const mongoose=require('mongoose')
const requirelogin = require('../middleware/requirelogin');
const Post=require('../models/post');
const userModel = require('../models/user');
// const Post=mongoose.model('post')
const router=express.Router();
router.get('/allpost',requirelogin,(req,res)=>{
    Post.find().populate("postedBy","_id name profileImage")
    .populate("comments.postedBy","_id name ")
    .then(posts=>{
        res.json({posts})
    }).catch(err=>{
        console.log(err)
    })
})
router.get('/friendspost',requirelogin,(req,res)=>{
    // console.log(req.user)
    Post.find({postedBy:{$in:req.user.following}})
    .populate("postedBy","_id name profileImage")
    .populate("comments.postedBy","_id name")
    .then(posts=>{
        res.json({posts})
    }).catch(err=>{
        console.log(err)
    })
})
router.post('/postdata',requirelogin,(req,res)=>{
console.log("request.user",req.user)
const {title,body,pic}=req.body;
if(!title||!body||!pic){
   return res.json({error:"please add all the required fields"});
}
req.user.password=undefined;
const post=new Post({
    title,
    body,
    photo:pic,
    postedBy:req.user
})
post.save().then(result=>{
    res.json({result})
}).catch(err=>console.log(err))
})
router.get('/myposts',requirelogin,(req,res)=>{
    Post.find({postedBy:req.user.id}).populate(
        "postedBy","_id name"
    ).then(myposts=>{
        userModel.findById(req.user.id)
        .then(user=>{

            // console.log(myposts)
            res.json({myposts,user})
        })
    }).catch(err=>console.log(err))
})
router.put("/like",requirelogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id}
       
    },
    {
        new:true
    }
    )
    .populate("comments.postedBy","name _id")
    .populate("postedBy","_id name profileImage")
    .exec((err,result)=>{
        if(err){
            res.send(err)
        }else{
            // console.log(result)
            res.json(result)
        }
    })
})
router.put("/unlike",requirelogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
       
    },
    {
        new:true
    }
    )
    .populate("comments.postedBy","name _id")
    .populate("postedBy","_id name profileImage")
    .exec((err,result)=>{
        if(err){
            res.send(err)
        }else{
            res.json(result)
        }
    })
})
router.put("/comment",requirelogin,(req,res)=>{
    const comment={
        text:req.body.text,
        postedBy:req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
       
    },
    {
        new:true
    }
    ).populate("comments.postedBy","_id name")
    .populate("postedBy","_id name profileImage")
    .exec((err,result)=>{
        if(err){
            res.send(err)
        }else{
            res.json(result)
        }
    })
})
router.put("/uncomment",requirelogin,(req,res)=>{
//   console.log("commentId:"+req.body.commentId,"postId:"+req.body.postId)
//  const post= Post.findById(req.body.postId)
    Post.findByIdAndUpdate(req.body.postId,{
        // $pull:{comments:req.body.commentId}
       
        $pull:{comments:{_id:req.body.commentId}}
        // $pull: { results: { $elemMatch: { score: 8 , item: "B" } } } }
    },
    {
        new:true
    }
    )
    .populate("comments.postedBy","name")
    .populate("postedBy","name _id profileImage")
    .exec((err,result)=>{
        if(err){
            res.send(err)
        }else{
            res.json(result)
        }
    })
})
router.delete("/deletepost",requirelogin,(req,res)=>{
    // console.log(req.body.postId)
    Post.findByIdAndRemove(req.body.postId).exec((err,data)=>{
        if(err){
            res.status(412).json(err);
        }else{
            // console.log(data)
            res.status(200).json(data)
        }
    })
})
module.exports=router;