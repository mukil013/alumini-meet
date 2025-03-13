const User = require('../model/userModel');
const mongoose = require('mongoose');

const dotenv =require('dotenv');

dotenv.config();

const registerUser = async (req, res) => {
    try{
        const user = await User.find({email: req.body.email});
        if(user.length === 0){
            const user = await User.create({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: req.body.password,
                gender: req.body.gender,
                phoneNumber: req.body.phone,
                role: req.body.role
            });  
            
            const userDetail = {
                firstName: user.firstName,
                email: user.email,
                password: user.password,
                gender: user.gender,
                phoneNumber: user.phoneNumber,
                userId: user._id,
                role: user.role
            }

            res.status(200).json({
                status: "Success",
                messsage: "user registered successfully.",
                userDetail: userDetail
            });
        }else{
            res.status(409).json({
                status: "failed",
                message: "user already present."
            });
        }
    }catch(error){
        res.status(500).json({
            status: "failure",
            message: `user cannot be registed ${error}.`
        });
    }
}

const validateUser = async (req, res) =>{
    try{
        const user = await User.find({
            email: req.body.email,
            password: req.body.password
        });
        if(user.length === 0){
            res.status(400).json({
                status: "failure",
                message: "user does not exists."
            });
        }else{
            const userDetail = {
                firstName: user[0].firstName,
                email: user[0].email,
                password: user[0].password,
                gender: user[0].gender,
                phoneNumber: user[0].phoneNumber,
                userId: user[0]._id,
                role: user[0].role
            }

            res.status(200).json({
                status: "success",
                message: "user logged in successfully.",
                userDetail: userDetail
            })
        }
    }catch(error){
        res.status(500).json({
            status: "failure",
            message: `No user found ${error}`,
          });
    }
}

module.exports = {registerUser, validateUser};