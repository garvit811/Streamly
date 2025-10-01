
# STREAMLY - A Backend for a Video Streaming Platform (YouTube Clone) 🎬

A robust and scalable backend service built with Node.js that powers a modern video streaming application. This project handles everything from user authentication and video processing to likes, comments and subscriptions.

## 🚀 About The Project

STREAMLY is the complete backend infrastructure for a video-sharing platform inspired by YouTube. It provides all the necessary APIs for user management, video uploads, playlists, social interactions like likes and comments, and a subscription system. The goal was to build a performant, secure, and feature-rich backend that can serve as the backbone for any modern video-centric application.
## ✨ Key Features

- User Authentication: Secure JWT (JSON Web Token) based authentication with password hashing.
- Video Management: APIs for uploading, updating, deleting, and fetching video details.
- Cloud Integration: Seamlessly integrates with cloud storage Cloudinary for video and image hosting.
- Social Interaction: Functionality for liking videos, writing comments.
- Subscription System: Users can subscribe to channels and view content from their subscribed creators.
- Advanced Search: Efficient search functionality to find videos or channels.
- Playlists: Users can create, update, and manage their own video playlists.
- Dashboard: Aggregated data for content creators (total views, subscribers, likes).
## 🛠️ Built With

This project is built using a modern tech stack to ensure performance and scalability.

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose (hosted on MongoDB Atlas)
- **Authentication**: JWT (jsonwebtoken), bcrypt.js
- **File Handling**: Multer
- **Cloud Storage**: Cloudinary
- **Middleware**: CORS (Cross-Origin Resource Sharing), Cookie-Parser
- **API Testing**: Postman
- **Deployment**: Render
## ⚙️ Getting Started

To get a local copy up and running, follow these simple steps.

#### **Prerequisites**
You need to have the following software installed on your machine:
- Node.js (v18.x or higher)
- npm
- A MongoDB instance (you can get a free one from MongoDB Atlas)


#### **Installation**
1. Clone the repository
```Bash
git clone https://github.com/garvit811/Streamly
```

2. Navigate to the project directory
```Bash
cd Streamly
```

3. Install dependencies
```Bash
npm install
```

4. Set up environment variables
Create a .env file in the root directory by renaming the .env.example file. Then, add your secret values:
```Code snippet
PORT = 
MONGODB_URI = 
CORS_ORIGIN = *
ACCESS_TOKEN_SECRET = 
ACCESS_TOKEN_EXPIRY = 
REFRESH_TOKEN_SECRET = 
REFRESH_TOKEN_EXPIRY = 
CLOUDINARY_URL = 
CLOUDINARY_CLOUD_NAME = 
CLOUDINARY_API_KEY =
CLOUDINARY_API_SECRET =
```

5. Start the server
```Bash
npm run dev
```

## 📂 Project Structure

The project follows a standard and scalable project structure.

```
STREAMLY/
├── .env
├── .gitignore
├── .prettierrc
├── .prettierignore
├── package.json
├── README.md
├── public/
│   └── temp/
└── src/
    ├── app.js
    ├── constants.js
    ├── index.js
    ├── db/
    │   └── index.js
    ├── controllers/
    │   ├── comment.controller.js
    │   ├── like.controller.js
    │   ├── playlist.controller.js
    │   ├── search.controller.js
    │   ├── subscription.controller.js
    │   ├── user.controller.js
    │   └── video.controller.js
    ├── middlewares/
    │   ├── auth.middleware.js
    │   └── multer.middleware.js
    ├── models/
    │   ├── comment.model.js
    │   ├── like.model.js
    │   ├── playlist.model.js
    │   ├── subscription.model.js
    │   ├── user.model.js
    │   └── video.model.js
    ├── routes/
    │   ├── comment.routes.js
    │   ├── like.routes.js
    │   ├── playlist.routes.js
    │   ├── search.routes.js
    │   ├── subscription.routes.js
    │   ├── user.routes.js
    │   └── video.routes.js
    └── utils/
        ├── ApiError.js
        ├── ApiResponse.js
        ├── asyncHandler.js
        └── cloudinary.js
    
```    
## 📖 API Endpoints

#### 👤 User Routes 

```http
   {{server}}/api/v1/users
```

| Method | Endpoint     | Description                |
| :-------- | :------- | :------------------------- |
| `Post` | `/register` | Register a new user |
| `Post` | `/login` | Login user & get token |
| `Post` | `/logout` | Logout user |
| `Post` | `/change-password` | Change password |
| `Get` | `/current-user` | Get current user info |
| `Patch` | `/update-account` | Update user details |
| `Post` | `/refresh-accessToken` | To refresh the access token |
| `Post` | `/avatar` | To update avatar |
| `Post` | `/coverImage` | To update cover image |
| `Get` | `/channel/:username` | To get Channel Profile |
| `Get` | `/history` | To fetch user watch history |



####  🎬  Video Routes

```http
  {{server}}/api/v1/videos
```

| Method | Endpoint     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `Post`      | `/publishvideo` | Post a video |
| `Get`      | `/video/:videoId` | Get video by Id |
| `Patch`      | `/video/:videoId` | Update Video |
| `Post`      | `/video/:videoId` | Delete Video |
| `Post`      | `/video/toggle-status/:videoId` | Toggle publish status of Video |


####  🔔 Subscription Routes

```http
  {{server}}/api/v1/subscribe
```

| Method | Endpoint     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `Post`      | `/subscribe_toggle/:c_id` | Subscribe or unsubscribe a channel |
| `Get`      | `/subscribers/:c_id` | Get subscriber for channel |
| `Get`      | `/subscribed_channels/:s_id` | Get subscribed channel of user |



####  👍 Like Routes

```http
  {{server}}/api/v1/like
```

| Method | Endpoint     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `Post`      | `/likes/video/:videoId` | Toggle a like on video |
| `Post`      | `/likes/comment/:commentId` | Toggle a like on comment |
| `Get`      | `/likes` | Get videos liked by user |


####  ✍️ Comment Routes

```http
  {{server}}/api/v1/comments
```

| Method | Endpoint     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `Post`      | `/comment/:commentId` | Delete a comment |
| `Post`      | `/addComment/:videoId` | Add a comment to video |
| `Patch`      | `/comment/:commentId` | Update/Edit a comment |


####   📋  Playlist Routes

```http
  {{server}}/api/v1/playlists
```

| Method | Endpoint     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `Post`      | `/playlist/create` | Create a Playlist |
| `Get`      | `/user-playlist/:userId` | Get all playlists created by user |
| `Get`      | `/playlist/:playlistId` | Get playlist by Id |
| `Post`      | `/playlist/:playlistId` | Delete playlist |
| `Patch`      | `/playlist/:playlistId` | Update playlist |
| `Post`      | `/playlist/:playlistId/video/:videoId` | Add video to playlist |
| `Post`      | `/remove-video/playlist/:playlistId/video/:videoId` | Delete video from playlist |


####  🔍  Search Routes

```http
  {{server}}/api/v1
```

| Method | Endpoint     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `Get`      | `/search` | Search by query |





## 🤝 How to Contribute

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

1. Fork the Project
2. Create your Feature Branch ``` git checkout -b feature/AmazingFeature ```
3. Commit your Changes ``` git commit -m 'Add some AmazingFeature' ```
4. Push to the Branch ``` git push origin feature/AmazingFeature```
5. Open a Pull Request

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.


## 👨‍💻 Contact

**Garvit Soni** - [LinkedIn Profile](https://www.linkedin.com/in/garvit-soni-6a02a1353/)