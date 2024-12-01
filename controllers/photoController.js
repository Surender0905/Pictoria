const { searchImages } = require("../services/unsplashService");
const {
    validatePhotoData,
    validateTags,
    validateSearchParams,
} = require("../utils/validations");
const {
    savePhoto,
    addTagsToPhoto,
    searchPhotosByTag,
} = require("../services/photoService");
const { tag: Tag } = require("../models");

const searchPhotos = async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({
            message: "Search query is required",
        });
    }

    try {
        const photos = await searchImages(query);

        if (photos.length === 0) {
            return res.status(404).json({
                message: "No images found for the given query",
            });
        }

        return res.status(200).json({ photos });
    } catch (error) {
        console.error("Search photos error:", error);
        return res.status(500).json({
            message: error.message || "Internal server error",
        });
    }
};

const savePhotoToCollection = async (req, res) => {
    try {
        const validation = validatePhotoData(req.body);
        if (!validation.isValid) {
            return res.status(400).json({ message: validation.message });
        }

        await savePhoto(req.body);

        return res.status(201).json({
            message: "Photo saved successfully",
            photo: req.body,
        });
    } catch (error) {
        console.error("Error saving photo:", error);
        return res.status(500).json({
            message: "Failed to save photo",
        });
    }
};

const addTagsToPhotoHandler = async (req, res) => {
    const { photoId } = req.params;
    const { tags } = req.body;

    try {
        // Validate tags
        const validation = await validateTags(tags, photoId, Tag);
        if (!validation.isValid) {
            return res.status(400).json({ message: validation.message });
        }

        // Add tags to photo
        await addTagsToPhoto(photoId, tags);

        return res.status(200).json({
            message: "Tags added successfully",
        });
    } catch (error) {
        console.error("Error adding tags:", error);

        if (error.message === "Photo not found") {
            return res.status(404).json({
                message: "Photo not found",
            });
        }

        return res.status(500).json({
            message: "Failed to add tags",
        });
    }
};

const searchPhotosByTagHandler = async (req, res) => {
    try {
        // Validate search parameters
        const validation = validateSearchParams(req.query);
        if (!validation.isValid) {
            return res.status(400).json({ message: validation.message });
        }

        const { tags, sort = "ASC", userId } = req.query;

        // Search photos
        const photos = await searchPhotosByTag(
            tags,
            sort.toUpperCase(),
            userId,
        );

        if (photos.length === 0) {
            return res.status(404).json({
                message: "No photos found with the specified tag",
            });
        }

        return res.status(200).json({ photos });
    } catch (error) {
        console.error("Error searching photos:", error);
        return res.status(500).json({
            message: "Failed to search photos",
        });
    }
};

module.exports = {
    searchPhotos,
    savePhotoToCollection,
    addTagsToPhotoHandler,
    searchPhotosByTagHandler,
};
