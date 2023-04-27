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

dotenv.config()
const app = express()

//using helmet for http request
app.use(helmet())



//to prevent too many request from one IP Address
const limit = rateLimit({
    max: 2,
    windowMs: 60 * 60 * 1000,
    message: "too many request from this IP"
})

app.use('/api', limit)

//body parser
app.use(express.json({limit: "10kb"}))


//prevent NoSQL injection
app.use(mongoSanitize())

//prevent xss attacks
app.use(xss())
//using cors fro cress origin
app.use(cors())

//using morgan which needed only in developmen
app.use(morgan("tiny"))


app.use('/api/v1', user)
app.use('/api/v1', task)

// testing()
//connecting to database
connection()

const PORT = 8000;

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`server running on http://localhost:${process.env.PORT}`);
})