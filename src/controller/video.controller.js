import mongoose, { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js"
import { Video } from "../models/video.model.js";

const publishVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body

    if (!title || !description) {
        throw new ApiError(400, "All fields are required")
    }

    const videoFileLocalPath = req.files?.videoFile[0]?.path
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path

    if (!videoFileLocalPath) {
        throw new ApiError(400, "Video file is required")

    }
    if (!thumbnailLocalPath) {
        throw new ApiError(400, "Thumbnail is required")
    }

    const videoFile = await uploadOnCloudinary(videoFileLocalPath)
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

    if (!videoFile) {
        throw new ApiError(500, "Video File is required")
    }
    if (!thumbnail) {
        throw new ApiError(500, "Thumbnail is required")
    }

    const video = await Video.create({
        videoFile: videoFile.url,
        thumbnail: thumbnail.url,
        owner: req.user._id,
        title,
        description,
        duration: videoFile.duration
    })

    if (!video) {
        throw new ApiError(500, "Something went wrong while uploading on cloudinary")
    }

    return res.status(200).json(
        new ApiResponse(201, video, "Video uploaded successfully")
    )
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params



    if (!videoId?.trim()) {
        throw new ApiError(400, "videoId is missing");

    }

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid videoId format");
    }

    await Video.findByIdAndUpdate(videoId, { $inc: { views: 1 } });

    const videos = await Video.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "video",
                as: "likes"
            }
        },
        {
            $lookup: {
                from: "comments",
                localField: "_id",
                foreignField: "video",
                as: "comments"
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "comments.owner",
                foreignField: "_id",
                as: "commentOwners"
            }
        },
        // 🔑 Merge comment + owner details
        {
            $addFields: {
                likesCount: { $size: "$likes" },
                comments: {
                    $map: {
                        input: "$comments",
                        as: "comment",
                        in: {
                            id: "$$comment._id",
                            content: "$$comment.content",
                            owner: {
                                $let: {
                                    vars: {
                                        ownerObj: {
                                            $arrayElemAt: [
                                                {
                                                    $filter: {
                                                        input: "$commentOwners",
                                                        as: "co",
                                                        cond: { $eq: ["$$co._id", "$$comment.owner"] }
                                                    }
                                                },
                                                0
                                            ]
                                        }
                                    },
                                    in: {
                                        _id: "$$ownerObj._id",
                                        fullName: "$$ownerObj.fullName",
                                        username: "$$ownerObj.username",
                                        avatar: "$$ownerObj.avatar"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        {
            $project: {
                _id: 1,
                videoFile: 1,
                owner: 1,
                thumbnail: 1,
                title: 1,
                description: 1,
                duration: 1,
                views: 1,
                likesCount: 1,
                comments: 1,
                isPublished: 1
            }
        }
    ])

    if (!videos?.length) {
        throw new ApiError(404, "Video does not exist")
    }

    const video = videos[0]

    if (!video.isPublished && video.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(404, "Video does not exist"); // hide unpublished video
    }

    return res.status(200).json(new ApiResponse(
        200,
        video,
        "Video fetched successfully"
    ))

})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!videoId?.trim()) {
        throw new ApiError(400, "videoId is missing");

    }

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid videoId format");
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "Video does not exist")
    }
    const oldUrl = video.thumbnail

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this video")
    }

    const updates = {};

    if (req.body?.title) updates.title = req.body.title;
    if (req.body?.description) updates.description = req.body.description;
    let deletedOld
    // If a new thumbnail file is uploaded
    if (req.file?.path) {
        const thumbnail = await uploadOnCloudinary(req.file.path);
        deletedOld = await deleteFromCloudinary(oldUrl, "image")
        if (!thumbnail?.url) throw new ApiError(500, "Thumbnail upload failed");
        updates.thumbnail = thumbnail.url;
    }

    // Make sure at least one field is being updated
    if (Object.keys(updates).length === 0) {
        throw new ApiError(400, "No valid fields provided to update");
    }

    const updatedVideo = await Video.findByIdAndUpdate(videoId, updates, { new: true });

    if (!updatedVideo) {
        throw new ApiError(500, "Something went wrong while updating the video")
    }

    return res.status(200).json(
        new ApiResponse(200, { updatedVideo, deletedOld }, "Video updated successfully")
    )

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!videoId?.trim()) {
        throw new ApiError(400, "videoId is missing");

    }

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid videoId format");
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "Video does not exist")
    }

    if (video.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this video")
    }

    const oldUrlVideo = video.videoFile
    const oldUrlThumbnail = video.thumbnail

    await Video.findByIdAndDelete(videoId)

    const deletedOld1 = await deleteFromCloudinary(oldUrlVideo, "video")
    const deletedOld2 = await deleteFromCloudinary(oldUrlThumbnail, "image")

    return res.status(200).json(
        new ApiResponse(200, { deletedOld1, deletedOld2 }, "Video deleted successfully")
    )
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!videoId?.trim()) throw new ApiError(400, "videoId is missing")
    if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid videoId format")

    const video = await Video.findById(videoId)
    if (!video) throw new ApiError(404, "Video does not exist")

    if (video.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You are not authorized to toggle publish status")
    }

    video.isPublished = !video.isPublished
    await video.save({ validateBeforeSave: false })

    const message = video.isPublished
        ? "Video is now published"
        : "Video is now unpublished"

    const responseData = {
        id: video._id,
        title: video.title,
        isPublished: video.isPublished,
        updatedAt: video.updatedAt
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            responseData,
            message
        ));
});


export {
    publishVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}