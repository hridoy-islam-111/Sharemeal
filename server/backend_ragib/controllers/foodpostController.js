const foodPostModel = require("../models/foodPostModel");
// creting food post
const createFoodPost = async (req, res) => {
    try {
        const {
            donor_id,
            food_type,
            quantity,
            expiry_time,
            latitude,
            longitude,
            status = "available"
        } = req.body;

        const image_url = req.file ? `/uploads/${req.file.filename}` : null;

        if (
            !donor_id ||
            !food_type ||
            !quantity ||
            !expiry_time ||
            latitude === undefined ||
            longitude === undefined
        ) {
            return res.status(400).json({
                message: "All required fields must be provided"
            });
        }

        const foodPost = await foodPostModel.createFoodPost(
            donor_id,
            food_type,
            quantity,
            expiry_time,
            latitude,
            longitude,
            image_url,
            status
        );

        res.status(201).json({
            message: "Food post created successfully",
            foodPost: foodPost
        });

    } catch (error) {
        console.error("Create food post error:", error);

        if (error.code === "23503") {
            return res.status(400).json({ message: "The donor ID does not exist in the users table" });
        }

        res.status(500).json({
            message: "Failed to create food post"
        });
    }
};
// getting all foods 
const getAllFoodPosts = async (req, res) => {
    try {
        const foodPosts = await foodPostModel.getAllFoodPosts();

        res.status(200).json({
            message: "Food posts retrieved successfully",
            foodPosts: foodPosts
        });

    } catch (error) {
        console.error("Get food posts error:", error);

        res.status(500).json({
            message: "Failed to retrieve food posts"
        });
    }
};
// getting food by id
const getFoodPostById = async (req, res) => {
    try {
        const { id } = req.params;

        const foodPost = await foodPostModel.getFoodPostById(id);

        if (!foodPost) {
            return res.status(404).json({
                message: "Food post not found"
            });
        }

        res.status(200).json({
            message: "Food post retrieved successfully",
            foodPost: foodPost
        });

    } catch (error) {
        console.error("Get food post error:", error);

        res.status(500).json({
            message: "Failed to retrieve food post"
        });
    }
};

// updating food post
// updating food post 
const updateFoodPost = async (req, res) => {
    try {
        const { id } = req.params;
        const { food_type, quantity, expiry_time, latitude, longitude, status } = req.body;
        const image_url = req.file ? `/uploads/${req.file.filename}` : null;

        if (
            !food_type || 
            !quantity || 
            !expiry_time || 
            latitude === undefined || 
            longitude === undefined
        ) {
            return res.status(400).json({ 
                message: "All required fields must be provided" 
            });
        }

        const foodPost = await foodPostModel.updateFoodPost(
            id, 
            food_type, 
            quantity, 
            expiry_time, 
            latitude, 
            longitude,
            image_url,
            status
        );

        if (!foodPost) {
            return res.status(404).json({ 
                message: "Food post not found" 
            });
        }

        res.status(200).json({ 
            message: "Food post updated successfully", 
            foodPost: foodPost 
        });
    } catch (error) {
        console.error("Update food post error:", error);
        res.status(500).json({ 
            message: "Failed to update food post" 
        });
    }
};

// deleting food post 
const deleteFoodPost = async (req, res) => {
    try {
        const { id } = req.params;
        const foodPost = await foodPostModel.deleteFoodPost(id);

        if (!foodPost) {
            return res.status(404).json({ 
                message: "Food post not found" 
            });
        }

        res.status(200).json({ 
            message: "Food post deleted successfully", 
            foodPost: foodPost 
        });
    } catch (error) {
        console.error("Delete food post error:", error);
        res.status(500).json({ 
            message: "Failed to delete food post" 
        });
    }
};
module.exports = {
    createFoodPost,
    getAllFoodPosts,
    getFoodPostById,
    updateFoodPost,
    deleteFoodPost
};
