import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
const app = express();


app.use(cors({
    origin:process.env.CORS_ORIGIN, // Allow all origins by default, or specify a specific origin
    credentials:true, // Allow credentials to be sent
}))

app.use(express.json()); // Middleware to parse JSON bodies

app.use(express.urlencoded({ extended: true ,limit:'16kb'})); // Middleware to parse URL-encoded bodies
app.use(express.static('public')); // Serve static files from the 'public' directory

app.use(cookieParser()); // Middleware to parse cookies



//routes import
import userRouter from './routes/user.routes.js';

//routes declaration
app.use('/api/v1/users',userRouter)
//https://localhost:8000/api/v1/users/register








export default app; //{app} // Exporting the app instance for use in other modules}