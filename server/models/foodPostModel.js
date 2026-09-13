const db = require('../config/db');

/**
 * Food Post Model - database operations for food_posts table
 */

const createFoodPost = async ({
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
  status = 'available'
}) => {
  const query = `
    INSERT INTO food_posts
    (
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
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    RETURNING *;
  `;
  const values = [
    donor_id,
    food_type,
    quantity,
    expiry_time,
    district || null,
    thana || null,
    area_ward || null,
    road_no || null,
    house_no || null,
    floor_flat || null,
    latitude ? parseFloat(latitude) : null,
    longitude ? parseFloat(longitude) : null,
    image_url || null,
    status
  ];
  const result = await db.query(query, values);
  return result.rows[0];
};

const getAllFoodPosts = async () => {
  const query = `
    SELECT *
    FROM food_posts
    ORDER BY id DESC;
  `;
  const result = await db.query(query);
  return result.rows;
};

const getFoodPostById = async (id) => {
  const query = `
    SELECT *
    FROM food_posts
    WHERE id = $1;
  `;
  const result = await db.query(query, [id]);
  return result.rows[0];
};

const updateFoodPost = async (id, {
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
}) => {
  const query = `
    UPDATE food_posts 
    SET 
      food_type = COALESCE($1, food_type), 
      quantity = COALESCE($2, quantity), 
      expiry_time = COALESCE($3, expiry_time), 
      district = COALESCE($4, district),
      thana = COALESCE($5, thana),
      area_ward = COALESCE($6, area_ward),
      road_no = COALESCE($7, road_no),
      house_no = COALESCE($8, house_no),
      floor_flat = COALESCE($9, floor_flat),
      latitude = COALESCE($10, latitude), 
      longitude = COALESCE($11, longitude),
      image_url = COALESCE($12, image_url),
      status = COALESCE($13, status)
    WHERE id = $14
    RETURNING *;
  `;
  const values = [
    food_type,
    quantity,
    expiry_time,
    district,
    thana,
    area_ward,
    road_no,
    house_no,
    floor_flat,
    latitude ? parseFloat(latitude) : null,
    longitude ? parseFloat(longitude) : null,
    image_url,
    status,
    id
  ];
  const result = await db.query(query, values);
  return result.rows[0];
};

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
