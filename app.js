import connection from './database/db.js';
import user from './routes/user.js';
import task from './routes/task.js'
import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import errorMiddleware from "./middleware/errors.js";
import AppError from './utils/AppError.js';
dotenv.config()

//Handling uncaughtException
process.on("uncaughtException", ()=>{
    console.log("sorry, something unusual happened");
        process.exit(1)
})

//calling express
const app = express()

//using helmet for http request
app.use(helmet())



//to prevent too many request from one IP Address
const limit = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: "too many request from this IP"
})

app.use('/api', limit)

//body parser
app.use(express.json({limit: "10kb"}))
app.use(express.urlencoded({extended: false}))
app.use(express.static("./uploads/"))


//prevent NoSQL injection
app.use(mongoSanitize())

//prevent xss attacks
app.use(xss())
//using cors fro cress origin
app.use(cors())

//using morgan which needed only in development

if(process.env.NODE_ENV == "development"){
    app.use(morgan("dev"))
}


app.use('/api/v1', user)
app.use('/api/v1', task)


//unhandled routes

app.all("*", (req, res, next)=>{
    next(new AppError(`cannot find ${req.originalUrl} on this server`, 404))
})



//Error handler Middleware and it should be the last thing
app.use(errorMiddleware)

//connecting to database
connection()

const PORT = 8000;

const server = app.listen(process.env.PORT || PORT, ()=>{
    console.log(`server running on http://localhost:${process.env.PORT}`);
})


//Handling unhandledrejection
process.on("unhandledRejection", ()=>{
    console.log("sorry, could not proceed with request");
    server.close(()=>{
        process.exit(1)
    })
})