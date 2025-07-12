import Router from 'express';
import {registerUser,loginUser,logoutUser,refreshAccessToken} from '../controllers/user.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
const router =Router();


router.route("/register").post(
    upload.fields([{
        name: 'avatar', // Field name for the avatar image
        maxCount: 1, // Maximum number of files for this field
    },{
        name:'coverImage', // Field name for the cover image
        maxCount: 1, // Maximum number of files for this field
    }])
    ,
    registerUser);


router.route("/login").post(loginUser);

//secured routes
router.route("/logout").post(verifyJWT,logoutUser);
router.route("/refresh-tokens").post(refreshAccessToken);

export default router;