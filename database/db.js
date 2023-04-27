import mongoose from "mongoose";

const connection = ()=>{
    mongoose.connect(process.env.DB_URL)
        .then((data)=>{
            console.log(`database connected successfully on ${data.connection.host}`);
})      .catch((error)=>{
        console.log(`could not connect ${error}`);
})

} 

export default connection;