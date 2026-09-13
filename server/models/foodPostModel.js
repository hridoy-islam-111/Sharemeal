const db = require('../config/db');

// Creating food post
const createFoodPost = async (
  donor_id,
  food_type,
  quantity,
  expiry_time,
  latitude,
  longitude,
  image_url,
  status = 'available'
) => {
  const query = `
    INSERT INTO food_posts
    (
      donor_id,
      food_type,
      quantity,
      expiry_time,
      latitude,
      longitude,
      image_url,
      status
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *;
  `;
  const values = [donor_id, food_type, quantity, expiry_time, latitude, longitude, image_url, status];
  const result = await db.query(query, values);
  return result.rows[0];
};

// Getting all food posts
const getAllFoodPosts = async () => {
  const query = `
    SELECT *
    FROM food_posts
    ORDER BY id DESC;
  `;
  const result = await db.query(query);
  return result.rows;
};

// Getting food post by id
const getFoodPostById = async (id) => {
  const query = `
    SELECT *
    FROM food_posts
    WHERE id = $1;
  `;
  const result = await db.query(query, [id]);
  return result.rows[0];
};

// Updating food post
const updateFoodPost = async (id, food_type, quantity, expiry_time, latitude, longitude, image_url, status) => {
  const query = `
    UPDATE food_posts 
    SET 
      food_type = $1, 
      quantity = $2, 
      expiry_time = $3, 
      latitude = $4, 
      longitude = $5,
      image_url = COALESCE($6, image_url),
      status = COALESCE($7, status)
    WHERE id = $8
    RETURNING *;
  `;
  const values = [food_type, quantity, expiry_time, latitude, longitude, image_url, status, id];
  const result = await db.query(query, values);
  return result.rows[0];
};

// Deleting food post
const deleteFoodPost = async (id) => {
  const query = `
    DELETE FROM food_posts 
    WHERE id = $1 
    RETURNING *;
  `;
  const result = await db.query(query, [id]);
  return result.rows[0];
};

module.exports = {
  createFoodPost,
  getAllFoodPosts,
  getFoodPostById,
  updateFoodPost,
  deleteFoodPost
};
