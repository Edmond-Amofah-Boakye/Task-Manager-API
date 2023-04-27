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
    }
})

export default mongoose.model("task", taskModel)