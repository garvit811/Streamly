import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
} from "../controller/playlist.controller.js"

const router = Router()

router.route("/playlist/create").post(verifyJWT, upload.none(), createPlaylist)

router.route("/user-playlist/:userId").get(verifyJWT, upload.none(), getUserPlaylists)

router.route("/playlist/:playlistId").get(verifyJWT, upload.none(), getPlaylistById)
    .post(verifyJWT, upload.none(), deletePlaylist)
    .patch(verifyJWT, upload.none(), updatePlaylist)

router.route("/playlist/:playlistId/video/:videoId").post(verifyJWT, upload.none(), addVideoToPlaylist)

router.route("/remove-video/playlist/:playlistId/video/:videoId").post(verifyJWT, upload.none(), removeVideoFromPlaylist)

export default router