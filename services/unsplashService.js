const axiosInstance = require("../lib/axios");

const searchImages = async (query) => {
    try {
        const response = await axiosInstance.get("/search/photos", {
            params: { query },
        });

        if (!response.data.results || response.data.results.length === 0) {
            return [];
        }

        return response.data.results.map((photo) => ({
            imageUrl: photo.urls.regular,
            description: photo.description || "",
            altDescription: photo.alt_description || "",
        }));
    } catch (error) {
        console.error(
            "Unsplash API Error:",
            error.response?.data || error.message,
        );
        throw new Error("Failed to fetch images from Unsplash");
    }
};

module.exports = {
    searchImages,
};
