import {v2 as cloudinary} from "cloudinary";
import fs from "fs";
cloudinary.config({
        cloud_name:process.env.CLOUDINARY_CLOUD_NAME, // Your Cloudinary cloud name
        api_key:process.env.CLOUDINARY_API_KEY, // Your
        api_secret:process.env.CLOUDINARY_API_SECRET, // Your Cloudinary API secret
})


const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath){
            return null;
        }
      const response = await  cloudinary.uploader.upload(localFilePath,{resource_type:"auto"})
     
    fs.unlinkSync(localFilePath);
            // Return Cloudinary upload response
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath); // Delete the local file if upload fails
        //remove the file from the local server because the file is not uploaded on cloudinary
        console.error("Error uploading file to Cloudinary:", error);
    }
}

export {uploadOnCloudinary}
