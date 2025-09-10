import { Router } from "express";
import { loginUser, logoutUser, refreshAccessToken, userRegister } from "../controller/user.cotroller.js";
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
export default router