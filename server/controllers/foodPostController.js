const foodPostModel = require('../models/foodPostModel');

// Creating food post
const createFoodPost = async (req, res) => {
  try {
    const {
      donor_id,
      food_type,
      quantity,
      expiry_time,
      district,
      thana,
      area_ward,
      road_no,
      house_no,
      floor_flat,
      latitude,
      longitude,
      status = 'available'
    } = req.body;

    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    if (!donor_id || !food_type || !quantity || !expiry_time) {
      return res.status(400).json({
        message: 'Donor ID, Food Type, Quantity, and Expiry time are required.'
      });
    }

    const foodPost = await foodPostModel.createFoodPost({
      donor_id,
      food_type,
      quantity,
      expiry_time,
      district,
      thana,
      area_ward,
      road_no,
      house_no,
      floor_flat,
      latitude,
      longitude,
      image_url,
      status
    });

    res.status(201).json({
      message: 'Food post created successfully',
      foodPost
    });
  } catch (error) {
    console.error('Create food post error:', error);

    if (error.code === '23503') {
      return res.status(400).json({ message: 'The donor ID does not exist in the users table' });
    }

    res.status(500).json({
      message: 'Failed to create food post: ' + error.message
    });
  }
};

// Getting all food posts
const getAllFoodPosts = async (req, res) => {
  try {
    const foodPosts = await foodPostModel.getAllFoodPosts();

    res.status(200).json({
      message: 'Food posts retrieved successfully',
      foodPosts
    });
  } catch (error) {
    console.error('Get food posts error:', error);

    res.status(500).json({
      message: 'Failed to retrieve food posts'
    });
  }
};

// Getting food post by id
const getFoodPostById = async (req, res) => {
  try {
    const { id } = req.params;

    const foodPost = await foodPostModel.getFoodPostById(id);

    if (!foodPost) {
      return res.status(404).json({
        message: 'Food post not found'
      });
    }

    res.status(200).json({
      message: 'Food post retrieved successfully',
      foodPost
    });
  } catch (error) {
    console.error('Get food post error:', error);

    res.status(500).json({
      message: 'Failed to retrieve food post'
    });
  }
};

// Updating food post
const updateFoodPost = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      food_type,
      quantity,
      expiry_time,
      district,
      thana,
      area_ward,
      road_no,
      house_no,
      floor_flat,
      latitude,
      longitude,
      status
    } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    const foodPost = await foodPostModel.updateFoodPost(id, {
      food_type,
      quantity,
      expiry_time,
      district,
      thana,
      area_ward,
      road_no,
      house_no,
      floor_flat,
      latitude,
      longitude,
      image_url,
      status
    });

    if (!foodPost) {
      return res.status(404).json({
        message: 'Food post not found'
      });
    }

    res.status(200).json({
      message: 'Food post updated successfully',
      foodPost
    });
  } catch (error) {
    console.error('Update food post error:', error);
    res.status(500).json({
      message: 'Failed to update food post'
    });
  }
};

// Deleting food post
const deleteFoodPost = async (req, res) => {
  try {
    const { id } = req.params;
    const foodPost = await foodPostModel.deleteFoodPost(id);

    if (!foodPost) {
      return res.status(404).json({
        message: 'Food post not found'
      });
    }

    res.status(200).json({
      message: 'Food post deleted successfully',
      foodPost
    });
  } catch (error) {
    console.error('Delete food post error:', error);
    res.status(500).json({
      message: 'Failed to delete food post'
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
