const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const unsplashApiKey = process.env.UNSPLASH_ACCESS_KEY;

const axiosInstance = axios.create({
    baseURL: "https://api.unsplash.com",
    headers: {
        Authorization: `Client-ID ${unsplashApiKey}`,
    },
});

module.exports = axiosInstance;
