const mongoose=require('mongoose')
const { ObjectId } = require('bson')
const postSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    photo:{
        type:String,
        required:true
    },
    likes:[{type:ObjectId,ref:"users"}],
    comments:[{
        text:String,
        postedBy:{
            type:ObjectId,
            ref:"users"
        }
    }],
    postedBy:{
        type:ObjectId,
        ref:"users"
    }
})
const Post= mongoose.model("post",postSchema)
module.exports=Post;