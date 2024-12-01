require("dotenv").config();
const express = require("express");
const app = express();

const { sequelize } = require("./models");
const { user } = require("./models");
const { createNewUser } = require("./controllers/userController");
const {
    searchPhotos,
    savePhotoToCollection,
    addTagsToPhotoHandler,
    searchPhotosByTagHandler,
} = require("./controllers/photoController");
const { getSearchHistory } = require("./controllers/searchHistoryController");

///middleware to parse json
app.use(express.json());

///end point to check health of server
app.get("/health", (req, res) => {
    res.status(200).json({ message: "Server is healthy" });
});

///end point to get users
app.get("/users", async (req, res) => {
    try {
        const users = await user.findAll();
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

app.post("/api/users", createNewUser);

app.get("/api/photos/search", searchPhotos);

app.post("/api/photos", savePhotoToCollection);

//add tags for photos
app.post("/api/photos/:photoId/tags", addTagsToPhotoHandler);

app.get("/api/photos/tag/search", searchPhotosByTagHandler);

app.get("/api/search-history", getSearchHistory);

//connect to database
sequelize
    .authenticate()
    .then(() => {
        console.log("Connected to the database");
    })
    .catch((err) => {
        console.log("Error: " + err);
    });
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
