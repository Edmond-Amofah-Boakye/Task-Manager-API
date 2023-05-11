import * as usercontroller from '../controller/userController.js'
import * as authController from "../controller/authController.js"
import auth from "../middleware/auth.js"
import restrictTo from '../middleware/roles.js'

import { Router } from "express";
import upload from '../middleware/uploads.js';

const router = Router();

//register user 

router.route('/user')
    .post(upload.single("image"), usercontroller.registerUser)
    .get(usercontroller.getusers)


//get users which is done by the admin

router.route('/user/:id').get(usercontroller.getSingleUser)


//update user password by me
router.route('/user/updatepassword').patch( auth, usercontroller.updateUserPassword)

//delete user by admin   ----- to be updated later!!!!!
router.route('/user/:id').delete(auth, restrictTo("admin"), usercontroller.deleteUser)



//login user

router.route("/user/login").post(authController.login)

//forgot password

router.route('/password/forgot').post(authController.forgotPassword)


//reset password through token
router.route('/passwordresest/:resetToken').patch(authController.resetPassword)

//updateMe
router.route('/user/update/me').patch(auth, authController.updateMe)


//deleteMe
router.route('/user/delete/me').delete(auth, authController.deleteMe)






export default router;