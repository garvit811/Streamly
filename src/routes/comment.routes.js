import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import { addComment, deleteComment, updateComment } from "../controller/comment.controller.js";

const router = Router()

router.route("/comment/:commentId").post(verifyJWT, deleteComment)
    .patch(verifyJWT, upload.none(), updateComment)

router.route("/addComment/:videoId").post(verifyJWT, upload.none(), addComment)


export default router