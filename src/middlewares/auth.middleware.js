import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import {User} from "../models/user.model.js";
import JWT from "jsonwebtoken";
export const verifyJWT = asyncHandler(async (req,_,next) => {
  try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
  
      if (!token) {
          throw new ApiError(401, "Access token is missing");
      }
  
      const decodedToken=JWT.verify(token, process.env.ACCESS_TOKEN_SECRET)
      console.log(decodedToken);
      

      const user = await User.findById(decodedToken._id).select("-password -refreshToken");
      if (!user) {
          throw new ApiError(401, "User not found");
      }
  
      req.user = user; // Attach user to request object
      next();
  } catch (error) {
    throw new ApiError(401, error?.message  || "Invalid access token");
  }
})