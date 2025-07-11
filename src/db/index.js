import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
const connectDB = async ()=>{
    try {
     const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
     console.log(`DATABASE CONNECTED || DB HOST : ${connectionInstance.connection.host}`);
     
    } catch (error) {
        console.log("error in connecting to the database", error);
        process.exit(1);
    }
}

export default connectDB;