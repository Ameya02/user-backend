const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const generateToken = require("../config/generateToken");
const bcrypt = require("bcrypt");
const registerUser = asyncHandler(async (req,res) => {
    const {email, password, pic} = req.body;

    if(!email || !password)
    {
        res.status(400);
        throw new Error("Please Enter all the fields");

    }
    const userExists = await User.findOne({ email: email });
    if(userExists) {
        res.status(400);
        throw new Error("User already exists");
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await  User.create({ email: email, password: hashedPassword, pic:pic });
    if(user) {
        res.status(201).json({
            _id: user._id,
            email: user.email,
            pic: user.pic,
            token:generateToken(user._id)
        });
    }
    else{
        res.status(400);
        throw new Error("Failed to create user");
    }

});

const loginUser = asyncHandler(async(req,res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email:email});
    if(!user) { throw new Error("User does not exist");}
    if(user.isSuspend) { throw new Error(user.SuspendReason);}
    if(user.isBlocked) { throw new Error(user.BlockReason);}
    const pwdMatch = await bcrypt.compare(password, user.password);
    await User.findOneAndUpdate({email:email}, {lastAccessed:Date.now()});
	if (!pwdMatch) throw new Error("Incorrect Password, Try Again");
    res.status(200).json({
            _id:user._id,
            email:user.email,
            pic:user.pic,
            token:generateToken(user._id),
            msg: user.isAdmin? "Admin Logged In":"User logged in successfully"
        });
 
})
const updateAuth = asyncHandler(async(req,res) => {
    const {email, password, newPassword, pic} = req.body;
    const user = await User.findOne({email:email});
    if(!user) { throw new Error("User does not exist");}
    const pwdMatch = await bcrypt.compare(password, user.password);
    if(!pwdMatch) { throw new Error("Incorrect Password, Try Again");}
    
    const hashedPassword = await bcrypt.hash(newPassword || password, 10);

    await User.findByIdAndUpdate(user._id,{password:hashedPassword, pic:pic||user.pic});
    res.status(200).json({
        _id:user._id,
        email:user.email,
        pic:user.pic,
        token:generateToken(user._id),
        msg:"Updated Successfully"
    });

})

const deleteAuth = asyncHandler(async(req,res) => {
    
    const {email, password} = req.body;

    const user = await User.findOne({email:email});
    if(!user) { throw new Error("User does not exist");}
    
    const pwdMatch = await bcrypt.compare(password, user.password);
    if(!pwdMatch) { throw new Error("Incorrect Password, Try Again");}
    await User.findByIdAndDelete(user._id);
    res.status(200).json({
        msg:"Successfully Deleted"
    })


})
const changePassword = asyncHandler(async(req,res) => {
    
    var {resetToken} = req.params;
    const {email} = req.body;
    if(!resetToken){
    const user = await User.findOne({email:email});
    if(user.isSuspend) { throw new Error(user.SuspendReason);}
    if(user.isBlocked) { throw new Error(user.BlockReason);}
    if(!user) { throw new Error("User does not exist");}
    var resetToken = crypto.randomBytes(64).toString('hex');
    await User.findById(user._id,{resetToken:resetToken});
    res.status(200).json({
        resetToken:resetToken
    })
} else{
    const user = await User.findOne({email:email});
    if(resetToken!=user.resetToken) { throw new Error("Reset Token does not match");}
    const {password} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const u = await  User.findByIdAndUpdate(user._id,{password:hashedPassword, resetToken:""});
    if(u) {
        res.status(201).json({
            _id: u._id,
            email: u.email,
            pic: u.pic,
            token:generateToken(u._id),
            msg:"Password Changed Successfully"
        });
    }
    else{
        res.status(400);
        throw new Error("Failed to create user");
    }
}
    
})






module.exports = {registerUser, loginUser,updateAuth,deleteAuth, changePassword};