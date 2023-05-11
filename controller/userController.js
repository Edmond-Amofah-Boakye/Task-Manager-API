import user from '../model/user.js';
import AppError from '../utils/AppError.js';

export async function registerUser(req, res, next){
    try {
        const newuser = new user({
            ...req.body,
            image: req.file.filename
        });
        await newuser.save();

        const signToken = await newuser.generateToken()

        //send the token through cookies // do this in all controllers that requires token
        //let us try with this first

        res.cookie("jwt", signToken, {
            expires: new Date((Date.now()+90*24*60*60*100)),
            httpOnly: true
        })

        res.status(201).json({newuser, signToken})
        
    } catch (error) {
        next(error)
    }
}


export async function getusers (req, res, next){
    try {
        const findUsers = await user.find({}).populate({
            path: 'tasks',
            select: "name"
        }).exec();
        
        return res.status(200).json({findUsers});
        
    } catch (error) {
        next(error)
    }
}

export async function getSingleUser (req, res, next){
    try {
        const findUser = await user.findById(req.params.id)
        if(!findUser){
            next(new AppError("no user found", 404))
        }
        return res.status(200).send(findUser)
    } catch (error) {
        next(error);
    }
}

export async function updateUserPassword (req, res, next){
    try {
        //check collection by the current user logged in
        const getUser = await user.findById(req.user.id).select("+password");
        if(!getUser){
            next(new AppError("no user found", 404))
        }

        //if thesere is user, update the pasword
        getUser.password = req.body.password;

        await getUser.save()


        //send token
        const token = await getUser.generateToken()

        return res.status(201).send({getUser, token})
        
    } catch (error) {
        next(error)
    }
}

export async function deleteUser (req, res, next){
    try {
        const findUser = await user.findByIdAndDelete(req.params.id);
        if(!findUser){
            next(new AppError("no user found", 404))
        }
        res.status(200).send("successfully deleted")
    } catch (error) {
        next(error)
    }
}






















