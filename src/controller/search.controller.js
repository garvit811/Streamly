import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";

const search = asyncHandler(async (req, res) => {
    const { q } = req.query;

    if (!q?.trim()) {
        throw new ApiError(400, "Search query is missing");
    }

    const videos = await Video.aggregate([
        {
            $match: {
                isPublished: true,
                $or: [
                    { title: { $regex: q, $options: "i" } },
                    { description: { $regex: q, $options: "i" } }
                ]
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "ownerInfo"
            }
        },
        { $unwind: "$ownerInfo" },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "video",
                as: "likes"
            }
        },
        {
            $addFields: {
                likesCount: { $size: "$likes" }
            }
        },
        {
            $project: {
                _id: 1,
                title: 1,
                description: 1,
                thumbnail: 1,
                duration: 1,
                views: 1,
                likesCount: 1,
                owner: {
                    _id: "$ownerInfo._id",
                    username: "$ownerInfo.username",
                    fullName: "$ownerInfo.fullName",
                    avatar: "$ownerInfo.avatar"
                }
            }
        }
    ]);

    const channels = await User.find({
        $or: [
            { username: { $regex: q, $options: "i" } },
            { fullName: { $regex: q, $options: "i" } }
        ]
    }).select("_id username fullName avatar");

    return res.status(200).json(
        new ApiResponse(200, { videos, channels }, "Search results fetched successfully")
    );
});

export { search };
