import { userModel } from "../models/user.model.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const handleSignUp=async(req,res)=>{
    const {username,email,password} = req.body;

    if(!username || !email || !password){
        console.log("fields not found")
        return res.status(400).json({"message":"All fields are required"})
    }
    try{
    const emailExists = await userModel.findOne({email})
    if(emailExists){
        console.log("email already exists")
        return res.status(400).json({"message":"User with this email already exists. Please head to the SignIn Page"})
    }
    const hashedPassword = await bcrypt.hash(password,10)
    const newUser = new userModel({
        username:username,
        email:email,
        password:hashedPassword
    })
    await newUser.save()
    console.log("signup success")
    return res.status(201).json({"message":"Signup Successful"})
    }
 catch(error){
    return res.status(500).json({"message":"Server Error",err:error})
    }
}

export const handleSignIn=async(req,res)=>{
    const {email,password} = req.body

    if(!email || !password){
        console.log("all fields are required")
        return res.status(400).json({"message":"All fields are required"})
    }
    try{
    const user = await userModel.findOne({email})
    if(!user){
        console.log("no user with this email")
        return res.status(400).json({"message":"Email or password Incorrect"})
    }
    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch){
        console.log("wrong password")
        return res.status(400).json({"message":"Email or password Incorrect"})
    }
    const session = jwt.sign({"userId":user._id},process.env.JWT_SECRET_KEY,{
        expiresIn:"1h"
    })
    res.cookie("session", session, {
  httpOnly: true,
  sameSite: "none",
  secure: true
})

    console.log("signin success")
    return res.status(200).json({"message":"SignIn successful"})
}
    catch(error){
        return res.status(500).json({"message":"Server Error",err:error})
    }
}
