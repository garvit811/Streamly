import mongoose, { isValidObjectId } from "mongoose"
import { Comment } from "../models/comment.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const addComment = asyncHandler(async (req, res) => {

    const { videoId } = req.params

    if (!videoId) {
        throw new ApiError(400, "No Video to comment on")
    }

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid videoId format")
    }

    const { content } = req.body
    const userId = req?.user._id

    if (!content) {
        throw new ApiError(400, "Please enter a comment")
    }

    const comment = await Comment.create({
        content,
        video: videoId,
        owner: userId
    })

    if (!comment) {
        throw new ApiError(500, "Something went wrong while creating comment")
    }

    return res.status(201).json(new ApiResponse(
        201,
        comment,
        "Comment added successfully"
    ))
})

const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params

    const { content } = req.body

    if (!commentId) {
        throw new ApiError(400, "No comment to update")
    }

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment Id")
    }

    if (!content) {
        throw new ApiError(400, "Ennter a new comment to update")
    }

    const userId = req.user._id
    const comment = await Comment.findById(commentId)

    if(!comment){
        throw new ApiError(400, "Comment does not exist")
    }

    if (comment.owner.toString() !== userId.toString()) {
        throw new ApiError(403, "You are not authorized to update this comment")
    }

    const updatedcomment = await Comment.findByIdAndUpdate(commentId, {
        $set: { content: content }
    }, { new: true })

    if (!updatedcomment) {
        throw new ApiError(500, "Failed to update comment")
    }

    return res.status(200).json(new ApiResponse(
        200,
        updatedcomment,
        "Comment updated Successfully"
    ))
})

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params

    if (!commentId) {
        throw new ApiError(400, "No comment to delete")
    }

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment Id")
    }

    const userId = req.user._id
    const comment = await Comment.findById(commentId)

    if(!comment){
        throw new ApiError(400, "Comment does not exist")
    }

    if (comment.owner.toString() !== userId.toString()) {
        throw new ApiError(403, "You are not authorized to Delete this comment")
    }

    await Comment.findByIdAndDelete(commentId)

    return res.status(200).json(new ApiResponse(
        200,
        {},
        "Comment deleted successfully"
    ))
})

export {
    addComment,
    updateComment,
    deleteComment
}