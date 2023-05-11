import AppError from "../utils/AppError.js";

const errors = (error, req, res, next) =>{

    error.statusCode = error.statusCode || 500;
    error.status = error.status || "error";


    //wrong mongoDB ID Error
    if(error.name === "CastError"){
        const message = `Resource not found with this id... Invalid ${error.path}`
        error = new AppError(message, 400)
    }

    //Duplicate key Error
    if(error.code === 1100){
        const message = `Duplicate key ${Object.keys(error.keyValue)} Entered`
        error = new AppError(message, 400)
    }

    //wrong jwt error
    if(error.name === "JsonWebTokenError"){
        const message = `Your URL is invalid, please try again later`
        error = new AppError(message, 400)
    }


    //wrong jwt erro
    if(error.name === "TokenExpiredError"){
        const message = `Your URL is expired, please try again later`
        error = new AppError(message, 400)
    }


    res.status(error.statusCode).json({
        status: error.status,
        message: error.message
    })
}

export default errors;














// //handing development errors
// // const developmentError = (error, res)=>{
// //     res.status(error.statusCode).json({
// //         status: error.status,
// //         message: error.message
// //     })
// // }

// //handling production error
// // const productionError = (error, res)=>{
// //     if(error.isOperational){
// //         res.status(error.statusCode).json({
// //             status: error.status,
// //             message: error.message
// //         })
// //     }else{
// //         console.error("Error", error);
// //         res.status(error.statusCode).json({
// //             status: "error",
// //             message: "something went wrong"
// //         })
// //     }
// // }
