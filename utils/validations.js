const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validateRequestBody = (body) => {
    if (!body.username || !body.email) {
        return {
            isValid: false,
            message: "Username and email are required",
        };
    }

    if (!validateEmail(body.email)) {
        return {
            isValid: false,
            message: "Invalid email format",
        };
    }

    return {
        isValid: true,
    };
};

const validatePhotoData = (photoData) => {
    // Check if required fields exist
    if (!photoData.imageUrl || !photoData.userId) {
        return {
            isValid: false,
            message: "Image URL and user ID are required",
        };
    }

    // Validate image URL
    if (!photoData.imageUrl.startsWith("https://images.unsplash.com/")) {
        return {
            isValid: false,
            message: "Invalid image URL. Must be from Unsplash",
        };
    }

    // Validate tags if they exist
    if (photoData.tags) {
        if (!Array.isArray(photoData.tags)) {
            return {
                isValid: false,
                message: "Tags must be an array",
            };
        }

        if (photoData.tags.length > 5) {
            return {
                isValid: false,
                message: "Maximum 5 tags allowed",
            };
        }

        for (const tag of photoData.tags) {
            if (tag.length > 20) {
                return {
                    isValid: false,
                    message: "Tag length cannot exceed 20 characters",
                };
            }
        }
    }

    return {
        isValid: true,
    };
};

const validateTags = async (tags, photoId, Tag) => {
    // Check if tags is an array
    if (!Array.isArray(tags)) {
        return {
            isValid: false,
            message: "Tags must be an array",
        };
    }

    // Validate individual tags
    for (const tag of tags) {
        if (typeof tag !== "string" || tag.trim().length === 0) {
            return {
                isValid: false,
                message: "Tags must be non-empty strings",
            };
        }
        if (tag.length > 20) {
            return {
                isValid: false,
                message: "Tag length cannot exceed 20 characters",
            };
        }
    }

    // Check existing tags count
    const existingTags = await Tag.count({ where: { photoId } });
    if (existingTags + tags.length > 5) {
        return {
            isValid: false,
            message: "Maximum 5 tags allowed per photo",
        };
    }

    return {
        isValid: true,
    };
};

const validateSearchParams = (query) => {
    console.log(query);
    // Validate tag
    if (!query.tags) {
        return {
            isValid: false,
            message: "Search tag is required",
        };
    }

    //Only a single tag is accepted as input query.
    if (query.tags.length < 2) {
        return {
            isValid: false,
            message: "Only a single tag is accepted as input query",
        };
    }
    // Validate sort order if provided
    if (query.sort && !["ASC", "DESC"].includes(query.sort.toUpperCase())) {
        return {
            isValid: false,
            message: "Sort order must be either ASC or DESC",
        };
    }

    return {
        isValid: true,
    };
};

const validateUserId = async (userId, User) => {
    if (!userId || isNaN(userId)) {
        return {
            isValid: false,
            message: "Valid user ID is required",
        };
    }

    const user = await User.findByPk(userId);
    if (!user) {
        return {
            isValid: false,
            message: "User not found",
        };
    }

    return {
        isValid: true,
    };
};

module.exports = {
    validateEmail,
    validateRequestBody,
    validatePhotoData,
    validateTags,
    validateSearchParams,
    validateUserId,
};
