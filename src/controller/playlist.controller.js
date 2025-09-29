import mongoose, { isValidObjectId } from "mongoose"
import { Playlist } from "../models/playlist.model.js"
import { Video } from "../models/video.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body

    if (!name?.trim() || !description?.trim()) {
        throw new ApiError(400, "All fields are required")
    }

    const userId = req.user?._id

    if (!userId) {
        throw new ApiError(401, "Unauthorized Access")
    }

    const createdplay = await Playlist.create({
        name: name,
        description: description,
        owner: userId
    })

    if (!createdplay) {
        throw new ApiError(500, "Failed to create playlist")
    }


    return res.status(200).json(
        new ApiResponse(
            201,
            createdplay,
            "Playlist created successfully"
        ))

})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params

    if (!userId || !isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid or missing userId")
    }

    const playlists = await Playlist.find({ owner: userId })
        .populate({
            path: "videos",
            match: { isPublished: true },
            select: "title thumbnail duration views",
            populate: { path: "owner", select: "_id fullName username avatar" }
        })
        .populate({
            path: "owner",
            select: "_id fullName username avatar"
        })

    return res.status(200).json(new ApiResponse(
        200,
        playlists,
        "Playlists fetched successfully"
    ))
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params

    if (!playlistId?.trim()) {
        throw new ApiError(400, "PlaylistId is required")
    }

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlistId format")
    }

    const playlist = await Playlist.findById(playlistId)
        .populate({
            path: "videos",
            match: { isPublished: true },
            select: "title thumbnail duration views",
            populate: { path: "owner", select: "_id fullName username avatar" }
        })
        .populate({
            path: "owner",
            select: "_id fullName username avatar"
        });

    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    return res.status(200).json(new ApiResponse(
        200,
        playlist,
        "Playlist fetched successfully"
    ))
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;

    if (!playlistId || !videoId) {
        throw new ApiError(400, "PlaylistId and VideoId are required")
    }

    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid PlaylistId or VideoId format")
    }

    const playlist = await Playlist.findById(playlistId)

    if (!playlist) throw new ApiError(404, "Playlist not found")

    if (playlist.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You are not authorized to add video to this playlist")
    }

    if (playlist.videos.includes(videoId)) {
        return res.status(400).json(
            new ApiResponse(400, playlist, "Video already in playlist")
        )
    }

    const video = await Video.findById(videoId)

    if (!video) throw new ApiError(404, "Video not found")

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        { $addToSet: { videos: videoId } },
        { new: true }
    )
        .populate({
            path: "videos",
            match: { isPublished: true },
            select: "title thumbnail duration views",
            populate: { path: "owner", select: "_id fullName username avatar" }
        })
        .populate({
            path: "owner",
            select: "_id fullName username avatar"
        })

    if (!updatedPlaylist) throw new ApiError(500, "Failed to add video to playlist")

    return res.status(200).json(
        new ApiResponse(200, updatedPlaylist, "Video added successfully")
    )
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params

    if (!playlistId || !videoId) {
        throw new ApiError(400, "PlaylistId and VideoId are required")
    }

    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid ID format")
    }

    const playlist = await Playlist.findById(playlistId)

    if (!playlist) throw new ApiError(404, "Playlist not found")

    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to modify this playlist")
    }

    if (!playlist.videos.includes(videoId)) {
        throw new ApiError(404, "Video not found in the playlist")
    }

    await Playlist.findByIdAndUpdate(
        playlistId,
        { $pull: { videos: videoId } },
        { new: true }
    );

    const updatedPlaylist = await Playlist.findById(playlistId)
        .populate({
            path: "videos",
            match: { isPublished: true },
            select: "title thumbnail duration views",
            populate: { path: "owner", select: "_id fullName username avatar" }
        })
        .populate({
            path: "owner",
            select: "_id fullName username avatar"
        })


    return res.status(200).json(
        new ApiResponse(200, updatedPlaylist, "Video removed successfully")
    );
});

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    
    if (!playlistId) {
        throw new ApiError(400, "playlistId is missing")
    }

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlistId format");
    }

    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        throw new ApiError(404, "Playlist is not found");

    }

    if (playlist.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete playlist");
    }

    await Playlist.findByIdAndDelete(playlistId)

    return res.status(200).json(new ApiResponse(
        200,
        {},
        "Playlist deleted successfully"
    ))
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    const { name, description } = req.body
    
    if (!playlistId || !name?.trim() || !description?.trim()) {
        throw new ApiError(400, "All fields are required")
    }

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlistId format")
    }

    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        throw new ApiError(404, "Playlist is not found")
    }

    if (playlist.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You are not authorized to update playlist");
    }

    const updatedplaylist = await Playlist.findByIdAndUpdate(playlistId, {
        $set: { name, description }
    }, { new: true })

    if (!updatedplaylist) {
        throw new ApiError(500, "Failed to update playlist")
    }

    return res.status(200).json(new ApiResponse(
        200,
        updatedplaylist,
        "Playlist updated successfully"
    ))

})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}