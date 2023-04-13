const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const userModel = require('../models/user')
const jwt=require('jsonwebtoken')
const {SECRET_KEY}=require("../config/keys");
const requirelogin = require("../middleware/requirelogin")


router.post('/signup', (req, res) => {
    const { name, email, password, url} = req.body;
    if (!name || !email || !password) {
        return res.json({ error: "fill all the credentials" })
    } else {
        userModel.findOne({ email: email }).then(savedUser => {
            if (savedUser) {
                return res.json({
                    message: "error! mail exist in our db"
                })
            }
            bcrypt.hash(password, 10).then(hashedPassword => {
                // console.log(url)
                const user = new userModel({
                    name,
                    email,
                    password:hashedPassword,
                    profileImage: url
                })
                user.save().then(user => {
                    res.json({
                        message: "SignedUp succesfully"
                    })
                }).catch(err => console.log(err))
            })

        }).catch(err => console.log(err))
    }
})
router.post('/signin',(req,res)=>{
    const {email,password}=req.body;
    if(!email||!password){
        return res.json({error:"please enter all the credentials"})
    }
    userModel.findOne({email:email}).then(userExist=>{
        if(!userExist){
        return res.json({error:"mail id or password are incorrect"})
        
        }
        // console.log("from userExist",userExist);
        bcrypt.compare(password,userExist.password)
        .then(passwordMatched=>{
            if(!passwordMatched){
                return res.json({error:"mail id or password are incorrect"})
            }
            else{
            const token=jwt.sign({_id:userExist._id},SECRET_KEY)

                // return res.json({message:"successfully logged in"})
                const {name,_id,email,following,followers,profileImage}=userExist;
                res.json({token,user:{
                   name,
                   _id,
                   email,
                   following,
                   followers,
                   profileImage
               }});
            }
        })
    })
})
module.exports = router;