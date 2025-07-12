import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import {User} from '../models/user.model.js';
import {upload} from '../middlewares/multer.middleware.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import JWT  from 'jsonwebtoken';


const genereteAccessAndRefreshToken = async (userId)=>{
    try {
        //find user by id
    const user=await User.findById(userId)


    //generate access token
    const accessToken = await user.generateAccessToken();
    //generate refresh token
    const refreshToken = await user.generateRefreshToken();

    // //save refresh token in user document
    user.refreshToken = refreshToken; // Set the refresh token in the user document
    await user.save({validateBeforeSave: false}); // This will not validate the user document before saving or don't need password

    // await User.findByIdAndUpdate(userId, {refreshToken}, {new: true});

    return {accessToken, refreshToken};
    } catch (error) {
        throw new ApiError(500,"Error in generating access and refresh token")
    }
}

const registerUser=asyncHandler(async (req,res)=>{
    // res.status(200).json({
    //     message:"OK",
    // })

    // steps to register a user
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return response




    //step 1: get user details from frontend
    const {fullName,email,password,userName}=req.body
    console.log(req.body);
    
    
    // console.log("email",email);

    //step 2: validation - not empty
    // if(!fullName || !email || !password || !userName){
    //     throw new ApiError(400,"All fields are required")
    // }

    if([fullName,email,password,userName].some((field)=>field?.trim()==="")){
        throw new ApiError(400,"All fields are required")
    }

    //step 3: check if user already exists: username, email
    // $or operator is used to check if any of the conditions are true
    // $or is a mongoose operator that allows you to specify multiple conditions
    const userExisted = await User.findOne({
        $or:[{userName},{email}]
    })

    
    

    if(userExisted){
        throw new ApiError(409,"User already exists with this username or email")
    }

    
    //step 4: check for images, check for avatar
    const avatarLocalPath=req.files?.avatar[0]?.path;
    const coverImageLocalPath=req.files?.coverImage[0]?.path;
    // let coverImageLocalPath;
    // if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
    //     coverImageLocalPath=req.files.coverImage[0].path;
    // }

    // console.log(req.files);
    
    

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar and Cover Image are required")
    }

    //step 5: upload them to cloudinary, avatar
    const avatar= await uploadOnCloudinary(avatarLocalPath);
    const coverImage= await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar){
        throw new ApiError(500,"Error uploading images to cloudinary")
    }

    //step 6: create user object - create entry in db
    const user=await User.create({ 
        fullName,
        email,
        userName: userName.toLowerCase(),
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        password
    })

    //step 7: remove password and refresh token field from response and
    //step 8: check for user creation


                                                    //in select we can use - to remove fields
                                                    ////-password means password will not be returned in response
                                                    //-refreshToken means refreshToken will not be returned in response
                                                    //by defalut mongoose returns all fields we need to remove from them
    const createdUser=await User.findById(user._id).select("-password -refreshToken")
    if(!createdUser){
        throw new ApiError(500,"User not created")
    }
   

    //step 9: return response
    return res.status(201).json(
        new ApiResponse(200,"User registered successfully",createdUser)
    )

})

const loginUser=(asyncHandler(async (req,res)=>{
    // req body -> data
    // username or email
    //find the user
    //password check
    //access and referesh token
    //send cookie


    //step 1: get user details from request body
    const {email,password,userName}=req.body;

    //step 2: validation - not empty username or email
    if(!(email || userName)){
        throw new ApiError(400,"Email and Password are required")
    }


    //step 3: check if user exists with username or email  // find user by username or email
    const user=await User.findOne({
        $or:[{userName},{email}]
    })


    if(!user){
        throw new ApiError(404,"User not found")
    }


    //step 4:password check 
    const isPasswordValid=await user.isPasswordCorrect(password);

    if(!isPasswordValid){
        throw new ApiError(401,"Invalid password is given")
    }

    //step 5: access and refresh token
    const {accessToken,refreshToken}=await genereteAccessAndRefreshToken(user._id);
    const loggedInUser=await User.findById(user._id).select("-password -refreshToken");

    //step 6: send cookie
    // const options={
    //     HttpOnly:true, // cookie is only accessible by the server
    //     Secure:true, // cookie is only sent over https
    // }
    const isProduction = process.env.NODE_ENV === "production";

    const options = {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        };


    return res
              .status(200)
                .cookie("accessToken",accessToken,options)
                .cookie("refreshToken",refreshToken,options)
                .json(new ApiResponse(200,"User logged in successfully",loggedInUser))


}))

const logoutUser=asyncHandler(async (req,res)=>{
    await User.findByIdAndUpdate(req.user._id, 
        {
        $set: { refreshToken: undefined }
        }, 
        {
        new: true,
        })

    const isProduction = process.env.NODE_ENV === "production";

    const options = {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
    };


    return res
           .status(200)
           .clearCookie("accessToken",options)
           .clearCookie("refreshToken",options)
            .json(new ApiResponse(200,{ },"User logged out successfully"))

})



const refreshAccessToken=asyncHandler(async (req,res)=>{
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken || req.header("Authorization")?.replace("Bearer ", "").trim();

    if(!incomingRefreshToken){
        throw new ApiError(401,"unauthorized request, refresh token is missing")
    }

   try {
        console.log("cookies:", req.cookies);
        console.log("body:", req.body);
        console.log("headers:", req.headers);
        console.log("incomingRefreshToken:", incomingRefreshToken);

    const decodedToken= JWT.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
 
    const user=await User.findById(decodedToken._id)
    if(!user){
         throw new ApiError(404,"User not found")
    }
 
    if(incomingRefreshToken !== user.refreshToken){
         throw new ApiError(401,"Refresh token is expired or invalid")
    }
 
     const isProduction = process.env.NODE_ENV === "production";
 
     const options = {
         httpOnly: true,
         secure: isProduction,
         sameSite: isProduction ? "none" : "lax",
     };
 
 
    const {accessToken,newRefreshToken}=await genereteAccessAndRefreshToken(user._id)
 
    return res.status(200)
             .cookie("accessToken",accessToken,options)
             .cookie("refreshToken",newRefreshToken,options)
             .json(new ApiResponse(200,"Access token refreshed successfully",{
                 accessToken,
                 newRefreshToken
             }))
 
   } catch (error) {
        throw new ApiError(401,error.message || "invalid refresh token")
   }

})

export {registerUser,loginUser,logoutUser,refreshAccessToken};
