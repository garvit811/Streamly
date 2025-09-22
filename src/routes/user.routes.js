import { Router } from "express";
import { 
    loginUser,
    logoutUser, 
    refreshAccessToken, 
    userRegister,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory
 } from "../controller/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }, 
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    userRegister
)

router.route("/login").post(upload.none(), loginUser)

router.route("/logout").post(upload.none(), verifyJWT, logoutUser)
router.route("/refresh-accessToken").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT, upload.none(), changeCurrentPassword)
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/update-account").patch(verifyJWT, upload.none(), updateAccountDetails) // used patch as we are only updating some enteries

router.route("/avatar").post(verifyJWT, upload.single("avatar"), updateUserAvatar)
router.route("/coverImage").post(verifyJWT, upload.single("coverImage"), updateUserCoverImage)

router.route("/channel/:username").get(verifyJWT, getUserChannelProfile)
router.route("/history").get(verifyJWT, getWatchHistory)


export default router