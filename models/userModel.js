const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    pic: {
        type: String,
        required: true,
        default: "https://res.cloudinary.com/dk3p3rsml/image/upload/v1630516807/default_profile_pic.jpg"
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isSuspend: {
        type: Boolean,
        default: false
    },
    SuspendReason:{
        type: String,
        default: ""
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    BlockReason:{
        type: String,
        default: ""
    },
    resetToken: {
        type: String,
        default: "",
        expires: '2h',
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastAccessed: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
