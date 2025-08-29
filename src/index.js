import dotenv from "dotenv";
import mongoose from "mongoose";
import express from "express";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
    path: './env'
})

app.on("error", (error) => {
  console.log("Error :", error);
  throw error 
})

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is listening at port : ${process.env.PORT}`)
    })
})
.catch((err) => {
    console.error("MONGO DB connection failed !!! ", err)
})

