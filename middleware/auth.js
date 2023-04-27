import Jwt  from "jsonwebtoken";
import userSchema from '../model/user.js';


const auth = async (req, res, next) =>{

    let token;

    //get token and check if it is true
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        
        token = req.headers.authorization.split(" ")[1];
    }

    if(!token){
        return res.status(401).send({message: "You cannot acess, login first"})
    }

    try {
        
        //verify token
         const decode = Jwt.verify(token, process.env.SECRET_KEY);

        //check if user still exist
        const user = await userSchema.findById(decode.id);

        if(!user){
            return next(res.staus(404).send("user not found"))
        }

        req.user = user;

        next() 
        
    } catch (error) {
        return next(res.status(401).send("not authorised to access this route"));
    }
   
}


export default auth;