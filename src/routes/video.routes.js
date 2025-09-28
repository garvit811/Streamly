import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { deleteVideo, getVideoById, publishVideo, togglePublishStatus, updateVideo } from "../controller/video.controller.js";

const router = Router()

router.route("/publishvideo").post(
    verifyJWT,
    upload.fields([
        {
            name: "videoFile",
            maxCount: 1
        },
        {
            name: "thumbnail",
            maxCount: 1
        }
    ]),
    publishVideo
)

router.route("/video/:videoId")
    .get(verifyJWT, getVideoById)
    .patch(verifyJWT, upload.single("thumbnail"), updateVideo)
    .post(verifyJWT, deleteVideo)

router.route("/video/toggle-status/:videoId").post(verifyJWT, togglePublishStatus)


export default router