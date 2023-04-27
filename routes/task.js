import * as taskController from '../controller/taskController.js'
import auth from '../middleware/auth.js';
import restricTo from '../middleware/roles.js'
import { Router } from "express";

const router = Router();

//create task
router.route('/task')
    .post(taskController.createTask)
    .get(taskController.getTask)

//get single task by id

router.route('/task/:id')
    .get(taskController.getSingleTask)
    .patch(taskController.updateTask)
    .delete(auth, restricTo("admin", "supervisor"),taskController.deleteTask)


export default router;