import mongoose from "mongoose";

const subscriptonSchema=mongoose.Schema({
    subscriber:{ // one who is subscribing
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    channel:{ //one to whom 'subscriber' is subscribing
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

},{timestamps:true})

export const Subscription=mongoose.model("Subscription",subscriptonSchema) 