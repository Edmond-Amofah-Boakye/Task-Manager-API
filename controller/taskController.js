import taskModel from '../model/task.js'

export async function createTask (req, res, next){
    const createTask = new taskModel(req.body)

    try {
        await createTask.save();
        return res.status(201).send(createTask);

    } catch (error) {
        return res.status(500).send(error);
    }
}


export async function getTask (req, res, next){
    try {
        const allTask = await taskModel.find({});
        return res.status(200).send(allTask)
    } catch (error) {
        return res.status(500).send(error);
    }
}

export async function getSingleTask(req, res, next){
    try {
        const findTask = await taskModel.findById(req.params.id);

        if(!findTask){
            return res.status(404).send("no task found");
        }

       return  res.status(200).send(findTask)

    } catch (error) {
        return res.status(500).send(error);
    }
}

export async function updateTask(req, res, next){
    try {
        const getTask = await taskModel.findById(req.params.id);

        if(!getTask){
            return res.status(404).send("no task found");
        }

        getTask.description = req.body.description;

        await getTask.save()

        return res.status(201).send(getTask);

    } catch (error) {
        return res.status(500).send(error);
    }
}


export async function deleteTask(req, res, next){
    try {
        const findUser = await taskModel.findByIdAndDelete(req.params.id);
        if(!findUser){
            return res.status(404).send("user not found");
        }

        return res.status(200).send("user successfully deleted");
    } catch (error) {
        return res.status(500).send(error);
    }
}