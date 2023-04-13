const mongoose =require('mongoose');
const { ObjectId } = require('bson')

const userSchema= mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    profileImage:{
        type:String,
        default:"https://www.freeiconspng.com/thumbs/no-image-icon/no-image-icon-0.png"
    },
    followers:[{
        type:ObjectId,
        ref:"users"
    }],
    following:[{
        type:ObjectId,
        ref:"users"
    }]

})
 const userModel=new mongoose.model('users',userSchema);
 module.exports=userModel;