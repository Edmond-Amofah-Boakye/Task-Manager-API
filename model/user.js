import crypto from "crypto"
import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Task from '../model/task.js'

const userModel = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    
    email:{
        type: String,
        required: [true, "email is required"],
        trim: true,
        unique: true,
        lowercase: true
    },

    role:{
        type: String,
        enum: ["user", "admin", "supervisor"],
        default: "user"
    },

    password:{
        type: String,
        required: [true, "password is required"],
        trim: true,
        minlenght: 8,
        select: false
    },

    image:{
        type: String
    },

    resetPasswordToken:{
        type: String
    },

    resetPasswordTokenExpires:{
        type: Date
    },

    active:{
        type: Boolean,
        default: true,
        select: false
    }

},{
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
}, {timestamps: true})

userModel.pre("save", async function(next){
    const user = this;

    if(user.isModified("password")){
        user.password = await bcrypt.hash(user.password, 10)
    }

    next()
})


userModel.pre(/^find/, function(next){
    this.find({active: {$ne: false}})
    next()
})


//compare password
userModel.methods.comparePassword = async function(password, userPassword){
    return await bcrypt.compare(password, userPassword);
}


//Generate Token

userModel.methods.generateToken = async function(){
    const user = this;
    return jwt.sign({id: user._id}, process.env.SECRET_KEY, {expiresIn: process.env.EXPIRES})
}


userModel.methods.generateReseteToken = async function(){
    const resetToken = crypto.randomBytes(32).toString("hex");
    this. resetPasswordToken = 
        crypto.createHash("sha256")
        .update(resetToken)
        .digest("hex");
    
        this.resetPasswordTokenExpires = Date.now() + 10 * 60 * 1000;
        
        return resetToken;

}

userModel.virtual('tasks',{
    ref: "task",
    localField: "_id",
    foreignField: "createdBy"
})


//This works when a user is deleted
// userModel.pre("remove", async function(next){
//     await Task.deleteMany({createdBy: this._id})
// })





export default mongoose.model("user", userModel)
