import express from "express"
import cookieParser from "cookie-parser"
import cors from 'cors'

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


//import routes
import userRoutes from "./routes/user.routes.js"
import subscriptionRoutes from "./routes/subscription.routes.js"
import videoRoutes from "./routes/video.routes.js"
import likeRoutes from "./routes/like.routes.js"
import commentRoutes from "./routes/comment.routes.js"

//declaring routes
app.use("/api/v1/users", userRoutes)
app.use("/api/v1/subscribe", subscriptionRoutes)
app.use("/api/v1/videos", videoRoutes)
app.use("/api/v1/like", likeRoutes)
app.use("/api/v1/comments", commentRoutes)

export {app}