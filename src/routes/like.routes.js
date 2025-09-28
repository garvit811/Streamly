import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { getLikedVideos, toggleCommentLike, toggleVideoLike } from "../controller/like.controller.js";

const router = Router()

router.route("/likes/video/:videoId").post(verifyJWT, toggleVideoLike)
router.route("/likes/comment/:commentId").post(verifyJWT, toggleCommentLike)

router.route("/likes").get(verifyJWT, getLikedVideos)


export default router