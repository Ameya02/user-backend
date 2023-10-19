const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const getAllUsers = asyncHandler(async (req,res) => {

    const users = await  User.find().select("-password");
    if(users) {
        res.status(201).json({
            users:users
        });
    }
    else{
        res.status(400);
        throw new Error("Failed to create user");
    }

});
const adminUpdateAccess = asyncHandler(async(req,res) => {
    
    const user = await User.findById(req.params.id);
    if(!user) { throw new Error("User does not exist");}
    await User.findByIdAndUpdate(user._id,{isSuspend:req.body.isSuspend,
        SuspendReason:req.body.SuspendReason,
        isBlocked:req.body.isBlocked,
        BlockedReason:req.body.BlockedReason
    });
    res.status(200).json({
       
        msg:"Updated Access Successfully"
    });

})

const adminDeleteAuth = asyncHandler(async(req,res) => {
    const user = await User.findById(req.params.id);
    if(!user) { throw new Error("User does not exist");}
  
    await User.findByIdAndDelete(user._id);
    res.status(200).json({
        msg:"Successfully Deleted"
    })


})


module.exports = {getAllUsers, adminUpdateAccess, adminDeleteAuth};