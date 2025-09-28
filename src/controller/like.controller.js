import mongoose, { isValidObjectId } from "mongoose"
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!videoId?.trim()) {
        throw new ApiError(400, "videoId is missing");

    }

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid videoId format");
    }

    const userId = req.user?._id
    if (!userId) {
        throw new ApiError(400, "Unathorized to like a video")
    }

    const existLikedVideo = await Like.findOne({
        video: videoId,
        likedBy: userId,
    })

    if (existLikedVideo) {
        await Like.findByIdAndDelete(existLikedVideo._id)

        return res.status(200).json(new ApiResponse(
            200,
            {},
            "Video unliked successfully"
        ))
    }

    const like = await Like.create({
        video: videoId,
        likedBy: userId,

    })

    if (!like) {
        throw new ApiError(500, "Failed to like");

    }

    return res.status(200).json(new ApiResponse(
        200,
        like,
        "Video is liked successfully"
    ))

})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params

    if (!commentId?.trim()) {
        throw new ApiError(400, "commentId is missing");

    }

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid commentId format");
    }

    const userId = req.user?._id
    if (!userId) {
        throw new ApiError(400, "Unauthorized to like a comment")
    }

    const existLikedcomment = await Like.findOne({
        comment: commentId,
        likedBy: userId
    })

    if (existLikedcomment) {
        await Like.findByIdAndDelete(existLikedcomment._id)
        return res.status(200).json(new ApiResponse(
            200,
            {},
            "Comment unliked successfully"
        ))

    }

    const commentlike = await Like.create({
        comment: commentId,
        likedBy: userId,

    })

    if (!commentlike) {
        throw new ApiError(500, "Failed to like");

    }

    return res.status(200).json(new ApiResponse(
        200,
        commentlike,
        "Comment is liked successfully"
    ))


})

const getLikedVideos = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(401, "Unauthorized Access");
    }

    const likedVideoDocs = await Like.find({
        likedBy: userId,
        video: { $exists: true, $ne: null }
    }).populate("video");

    const likedVideos = likedVideoDocs
        .map((like) => like.video)
        .filter(Boolean);

    return res.status(200).json(new ApiResponse(
        200,
        likedVideos,
        "Liked videos fetched successfully"
    ));
})

export {
    toggleCommentLike,
    toggleVideoLike,
    getLikedVideos
}