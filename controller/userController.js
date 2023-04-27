import user from '../model/user.js';

export async function registerUser(req, res, next){
    try {
        const newuser = new user(req.body);
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
        res.status(500).send(error)
    }
}


export async function getusers (req, res, next){
    try {
        const findUsers = await user.find({});
        return res.status(200).send(findUsers);
        
    } catch (error) {
        return res.status(500).send(error);
    }
}

export async function getSingleUser (req, res, next){
    try {
        const findUser = await user.findById(req.params.id);
        if(!findUser){
            return res.status(404).send("no user found")
        }
        return res.status(200).send(findUser)
    } catch (error) {
        return res.status(500).send(error);
    }
}

export async function updateUserPassword (req, res, next){
    try {
        //check collection by the current user logged in
        const getUser = await user.findById(req.user.id).select("+password");
        if(!getUser){
            next(res.status(404).send("user not found"))
        }

        //if thesere is user, update the pasword
        getUser.password = req.body.password;

        await getUser.save()


        //send token
        const token = await getUser.generateToken()

        return res.status(201).send({getUser, token})
        
    } catch (error) {
        return res.status(500).send(error)
    }
}

export async function deleteUser (req, res, next){
    try {
        const findUser = await user.findByIdAndDelete(req.params.id);
        if(!findUser){
            return res.status(404).send("no user found");
        }
        res.status(200).send("successfully deleted")
    } catch (error) {
        res.status(500).send(error)
    }
}






















