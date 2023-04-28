import mongoose from "mongoose";

const taskModel = new mongoose.Schema({
    description:{
        type: String,
        required: [true, "description is required"],
        trim: true
    },

    completed:{
        type: Boolean,
        default: false
    },

    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "user"
    }
})

taskModel.pre(/^find/, function(next){
    const user = this;
    user.populate({
        path: "createdBy",
        select: "name"
    })
    next()
})

export default mongoose.model("task", taskModel)