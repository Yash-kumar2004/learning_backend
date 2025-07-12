import mongoose from "mongoose";

const subscriptonSchema=mongoose.Schema({
    subscriber:{ // pne who is subscriobing
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    channel:{ //one to whom 'subscriober' is subscribing
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

},{})

export const Subscription=mongoose.model("Subscription",subscriptonSchema) 