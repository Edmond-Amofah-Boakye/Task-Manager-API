import user from '../model/user.js';
import sendMail from '../utils/email.js';
import crypto from 'crypto';



// user login

export async function login (req, res, next){
    try {

        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).send("provide email and password")
        }

        const checkUser = await user.findOne({email}).select('+password');

        if(!checkUser || !(await checkUser.comparePassword(password, checkUser.password))){
            return res.status(401).send("invald credentials")
        }
       
        const token = await checkUser.generateToken();

        res.status(201).json({
            token
        })

        
  
    } catch (error) {
        return res.status(500).send(error)
    }
}


//forgot password
export async function forgotPassword(req, res, next){
    const {email} = req.body;

    try {
        const finduser = await user.findOne({email});

    //check email provided by user
    if(!finduser){
        return next(res.status(404).send("no user found"))
    }

    //generate reset token using crypto ans save it to database 
    const resetToken = await finduser.generateReseteToken()

    await finduser.save({validateBeforeSave: false})

    //sent token to user through email

    const resetUrl = `http://localhost:3000/passwordrseset/${resetToken}`
    const message = `
        <h1>You have requested a password reset</h1>
        <p>Please go to thie link to reset your password</p>
        <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
    `
    try {
        await sendMail({
            to: finduser.email,
            subject: "PASSWORD RESET -- Expires in 10 Minutes",
            text: message
        })

       res.status(200).send("email sent");

    } catch (error) {
        finduser.resetPasswordToken = undefined;
        finduser.resetPasswordTokenExpires = undefined;

        await finduser.save()

        return next(res.status(500).send("could not be sent"))
    }
    } catch (error) {
        next(error)
    }
    
}



//reset password
export async function resetPassword(req, res, next){

    //create hash using the reset token that was attached to the reset link
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.resetToken)
        .digest("hex")

    try {
        //find the user using the params reset token collected
        const finduser = await user.findOne({
            resetPasswordToken,
            resetPasswordTokenExpires: {$gt: Date.now()}
        })

        //do something if user do not exist
        if(!finduser){
            return next(res.status(400).send("invalid token"))
        }

        //if user exist, reset password and clear token and expiration from database
        finduser.password = req.body.password;
        finduser.resetPasswordToken = undefined;
        finduser.resetPasswordTokenExpires = undefined;

        //save the user
        await finduser.save()

        //generate login token for the user

        const genToken = await finduser.generateToken()

        res.status(201).json({
            message: true,
            data: "reset password successful",
            genToken
        })
    } catch (error) {
        next(error)
    }
}


export async function updateMe(req, res, next){
    if(req.body.password){
        return next(res.status(400).send("this is nit for password update, check that route"))
    }

    try {
        const findUser = await user.findById(req.user.id);
    
        if(!findUser){
            return next(res.status(404).send("user not found"))
        }
    
        findUser.name = req.body.name;
        findUser.email = req.body.email;
    
        await findUser.save()
        
        return next(res.status(201).send("sucessfully updated"))
    } catch (error) {
        
        return next(res.status(500).send(error))
    }

}

//delete me
export async function deleteMe(req, res, next){

    try {
        const findUser = await user.findById(req.user.id);
    
        if(!findUser){
            return next(res.status(404).send("user not found"))
        }
    
        findUser.active = false;
    
        await findUser.save()
        
        return next(res.status(201).send("success"))
    } catch (error) {
        
        return next(res.status(500).send(error))
    }

}









