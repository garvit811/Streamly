import mongoose, { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Subscription } from "../models/subscription.model.js";
import { User } from "../models/user.model.js";


const toggleSubscription = asyncHandler(async (req, res) => {
    const {c_id} = req.params
    // TODO: toggle subscription
    
    if(!c_id?.trim()){
        throw new ApiError(400,"ChannelId is required")
    }
    
    if (!isValidObjectId(c_id)) {
        throw new ApiError(400, "Invalid channelId format");
    }

    const userId = req.user?._id
    if (!userId) {
        throw new ApiError(400, "userId is required")
    }

    if(c_id.toString() === userId.toString()){
        throw new ApiError(400,"You cannot subscribe to your own channel")
    }

    const existingSubscription = await Subscription.findOne({
        subscriber:userId,
        channel:c_id,
    })

    if(existingSubscription){
       await Subscription.findByIdAndDelete(existingSubscription._id)
       return res.status(200).json(new ApiResponse(
        200,
        {},
        "Unsubscribed successfully"
       ))
    }

    await Subscription.create({
         subscriber:userId,
         channel:c_id,
    })

    return res.status(201).json(new ApiResponse(
        201,
        {},
        "Subscribed successfully"
    ))





})



// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params
})


// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}