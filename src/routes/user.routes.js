import { Router } from "express";
import { userRegister } from "../controller/user.cotroller.js";
import { upload } from "../middleware/multer.middleware.js";

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


export default router