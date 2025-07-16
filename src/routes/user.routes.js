import Router from 'express';
import {registerUser,loginUser,logoutUser,refreshAccessToken,changeCurrentPassword,getCurrentUser,updateAccountDetails,updateUserAvatar,updateUserCoverImage,getWatchHistory} from '../controllers/user.controller.js';
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
router.route("/change-password").post(verifyJWT,changeCurrentPassword)
router.route("/current-user").get(verifyJWT,getCurrentUser)
router.route("/update-account").patch(verifyJWT,updateAccountDetails);


router.route("/avatar").patch(verifyJWT,upload.single("avatar"),updateUserAvatar)
router.route("/coverImage").patch(verifyJWT,upload.single("coverImage"),updateUserCoverImage)
router.route("/c/:userName").get(verifyJWT,getUserChannelProfile)
router.route("/histoy").get(verifyJWT,getWatchHistory)
export default router;