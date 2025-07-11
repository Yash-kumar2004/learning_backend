import dotenv from 'dotenv'
import connectDB from './db/index.js'
dotenv.config({ path: '../../.env' })
import app from './app.js'


connectDB()
.then(
  app.listen(process.env.PORT || 8000,()=>{
    console.log(`app is listening at PORT ${process.env.PORT || 8000}`);
  })
)
.catch((error)=>{
  console.log("mongoDB connection error",error);
})



















// import mongoose from 'mongoose'
// import {DB_NAME} from './constants'
// import express from 'express'
// const app=express()
// ;(async ()=>{
//   try {
//     await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//     app.on('error',(error)=>{
//         throw error;
//     })



// require('dotenv').config({path:'../../.env'})


//     app.listen(process.env.PORT,()=>{
//         console.log(`app is listening at PORT ${process.env.PORT}`);
//     })

//   } catch (error) {
//     console.log('E:error is found ',error);
//   }

// })()

