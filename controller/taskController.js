import taskModel from '../model/task.js'
import AppError from "../utils/AppError.js"

export async function createTask (req, res, next){
    const createTask = new taskModel({
        ...req.body,
        createdBy: req.user._id

    })

    try {
        await createTask.save();
        return res.status(201).send(createTask);

    } catch (error) {
        next(error);
    }
}


export async function getTask (req, res, next){
    try {
        const allTask = await taskModel.find({})
        return res.status(200).json({allTask})

    } catch (error) {
        next(error);
    }
}

export async function getSingleTask(req, res, next){
    try {
        const findTask = await taskModel.findById(req.params.id);

        if(!findTask){
           next(new AppError("no task found", 404))
        }

       return  res.status(200).send(findTask)

    } catch (error) {
        next(error);
    }
}

export async function updateTask(req, res, next){
    try {
        const getTask = await taskModel.findById(req.params.id);

        if(!getTask){
            next(new AppError("no task found", 404))
        }

        getTask.description = req.body.description;

        await getTask.save()

        return res.status(201).send(getTask);

    } catch (error) {
        next(error);
    }
}


export async function deleteTask(req, res, next){
    try {
        const findTask = await taskModel.findByIdAndDelete(req.params.id);

        if(!findTask){
            next(new AppError("no task found", 404))
        }

        return res.status(200).send("user successfully deleted");
    } catch (error) {
        next(error);
    }
}


export async function uploadImage(req, res, next){
    console.log(req.file);
   
}