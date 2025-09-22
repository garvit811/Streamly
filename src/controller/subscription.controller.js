import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Subscription } from "../models/subscription.model.js";

const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    const userId = req.user._id

    const isSubscribed = await Subscription.findOne({channel: channelId, subscriber: userId})

    if(!isSubscribed){
        const subscription = await Subscription.create({
            subscriber: userId,
            channel: channelId
        })

        const doneSubscription = await Subscription.findById(subscription._id)

        if(!doneSubscription){
            throw new ApiError(500, "Something went wrong while Subscribing the Channel")
        }

        return res.status(201).json(
            new ApiResponse(201, {subscribed : true}, "Channel subscribed successfully")
        )
    }
    else {
        const unsubscribing = await Subscription.deleteOne({channel: channelId, subscriber: userId})

        if(unsubscribing.deletedCount === 0){
            throw new ApiError(500, "Something went wrong while unsubscribing the channel")
        }

        return res.status(200).json(
            new ApiResponse(200, {subscribed : false}, "Channel unsubscribed successfully")
        )
    }
})


// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
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