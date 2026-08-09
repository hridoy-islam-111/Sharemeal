const { createFoodPost } = require('../models/foodPostModel');

const createPost = async (req, res) => {
  try {
    const donor_id = req.user.id;
    const { food_type, quantity, expiry_time, location, image_url } = req.body;

    const post = await createFoodPost({
      donor_id,
      food_type,
      quantity,
      expiry_time,
      location_latitude: location.latitude,
      location_longitude: location.longitude,
      image_url,
    });

    return res.status(201).json(post);
  } catch (err) {
    console.error('Create food post error:', err);
    return res.status(500).json({ message: 'Server error while creating food post' });
  }
};

module.exports = {
  createPost,
};
