import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const videoSchema=mongoose.Schema({
    videoFile :{
        type:String, //claudinary URL
        required:true
    },
    thumbnail:{
        type:String, //claudinary URL
        required:true
    },
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    duration:{
        type:Number,
        required:true,
    },
    views:{
        type:Number,
        default:0
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    isPublished:{
        type:Boolean,
        default:true
    }





},{timestamps:true});


videoSchema.plugin(mongooseAggregatePaginate);


export const Video=mongoose.model("Video",videoSchema); 