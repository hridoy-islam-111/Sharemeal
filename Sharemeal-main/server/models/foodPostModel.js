const pool = require('../config/db');

const formatPostRow = (row) => {
  if (!row) return null;
  return {
    id: Number(row.id),
    donor_id: Number(row.donor_id),
    food_type: row.food_type,
    quantity: row.quantity,
    expiry_time: row.expiry_time,
    location: {
      latitude: parseFloat(row.location_latitude),
      longitude: parseFloat(row.location_longitude),
    },
    image_url: row.image_url,
    status: row.status,
    created_at: row.created_at,
  };
};

const createFoodPost = async ({
  donor_id,
  food_type,
  quantity,
  expiry_time,
  location_latitude,
  location_longitude,
  image_url,
}) => {
  const result = await pool.query(
    `INSERT INTO FoodPosts (
      donor_id,
      food_type,
      quantity,
      expiry_time,
      location_latitude,
      location_longitude,
      image_url
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id, donor_id, food_type, quantity, expiry_time, location_latitude, location_longitude, image_url, status, created_at`,
    [
      donor_id,
      food_type,
      String(quantity),
      expiry_time,
      location_latitude,
      location_longitude,
      image_url,
    ]
  );

  return formatPostRow(result.rows[0]);
};

const findFoodPostById = async (id) => {
  const result = await pool.query('SELECT * FROM FoodPosts WHERE id = $1', [id]);
  return formatPostRow(result.rows[0]);
};

module.exports = {
  createFoodPost,
  findFoodPostById,
};
