import { v2 as cloudinary } from "cloudinary";
import { extractPublicId } from "cloudinary-build-url";
import fs from 'fs';
import { ApiError } from "./ApiError.js";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto'
        })
        console.log("File is uploaded successfully on Cloudinary : ", response.url)
        // console.log("File is uploaded successfully on Cloudinary (whole response) : ", response)
        fs.unlinkSync(localFilePath)
        return response
    } catch (error) {
        fs.unlinkSync(localFilePath)
    }
}

const deleteFromCloudinary = async (url, resource_type) => {
    try {
        const getPublicIdFromUrl = extractPublicId(url);
        const response = await cloudinary.uploader.destroy(getPublicIdFromUrl, {
            resource_type: resource_type || "image",
        });

        return response;
    } catch (error) {
        throw new ApiError(
            500,
            "Something went wrong while removing old image from cloudinary"
        );
    }
}


export { uploadOnCloudinary, deleteFromCloudinary }