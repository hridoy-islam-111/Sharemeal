const db = require('../config/db');

/**
 * FoodRequest Model - database operations for food_requests table
 */

const createFoodRequest = async ({
  food_post_id,
  receiver_id,
  is_anonymous = false,
  pickup_code,
  requested_quantity = 1,
  notes = ''
}) => {
  const query = `
    INSERT INTO food_requests (
      food_post_id,
      receiver_id,
      is_anonymous,
      pickup_code,
      requested_quantity,
      notes,
      status
    )
    VALUES ($1, $2, $3, $4, $5, $6, 'requested')
    RETURNING *;
  `;
  const values = [
    food_post_id,
    receiver_id,
    is_anonymous,
    pickup_code,
    requested_quantity,
    notes
  ];
  const result = await db.query(query, values);
  return result.rows[0];
};

const findById = async (id) => {
  const query = `
    SELECT 
      fr.*,
      fp.food_type,
      fp.quantity AS post_quantity,
      fp.district,
      fp.thana,
      fp.area_ward,
      fp.donor_id,
      u.name AS receiver_name,
      u.phone AS receiver_phone,
      u.email AS receiver_email,
      d.name AS donor_name,
      d.phone AS donor_phone
    FROM food_requests fr
    JOIN food_posts fp ON fr.food_post_id = fp.id
    JOIN users u ON fr.receiver_id = u.id
    LEFT JOIN users d ON fp.donor_id = d.id
    WHERE fr.id = $1;
  `;
  const result = await db.query(query, [id]);
  return result.rows[0];
};

const findExistingRequest = async (food_post_id, receiver_id) => {
  const query = `
    SELECT * FROM food_requests
    WHERE food_post_id = $1 AND receiver_id = $2 AND status IN ('requested', 'approved');
  `;
  const result = await db.query(query, [food_post_id, receiver_id]);
  return result.rows[0];
};

const findByReceiverId = async (receiverId) => {
  const query = `
    SELECT 
      fr.*,
      fp.food_type,
      fp.quantity AS post_quantity,
      fp.district,
      fp.thana,
      fp.area_ward,
      fp.road_no,
      fp.house_no,
      fp.image_url AS food_image_url,
      d.name AS donor_name,
      d.phone AS donor_phone
    FROM food_requests fr
    JOIN food_posts fp ON fr.food_post_id = fp.id
    LEFT JOIN users d ON fp.donor_id = d.id
    WHERE fr.receiver_id = $1
    ORDER BY fr.created_at DESC;
  `;
  const result = await db.query(query, [receiverId]);
  return result.rows;
};

const findIncomingForDonor = async (donorId) => {
  const query = `
    SELECT 
      fr.*,
      fp.food_type,
      fp.district,
      fp.thana,
      CASE 
        WHEN fr.is_anonymous = true THEN '🕵️ Anonymous Receiver'
        ELSE u.name 
      END AS receiver_display_name,
      CASE 
        WHEN fr.is_anonymous = true THEN 'Hidden for identity masking'
        ELSE u.phone 
      END AS receiver_display_phone,
      u.email AS receiver_email
    FROM food_requests fr
    JOIN food_posts fp ON fr.food_post_id = fp.id
    JOIN users u ON fr.receiver_id = u.id
    WHERE fp.donor_id = $1
    ORDER BY fr.created_at DESC;
  `;
  const result = await db.query(query, [donorId]);
  return result.rows;
};

const findByPickupCode = async (pickupCode) => {
  const query = `
    SELECT 
      fr.*,
      fp.food_type,
      fp.donor_id,
      u.name AS receiver_name,
      u.phone AS receiver_phone
    FROM food_requests fr
    JOIN food_posts fp ON fr.food_post_id = fp.id
    JOIN users u ON fr.receiver_id = u.id
    WHERE UPPER(fr.pickup_code) = UPPER($1);
  `;
  const result = await db.query(query, [pickupCode]);
  return result.rows[0];
};

const updateStatus = async (id, status) => {
  const isFulfilled = status === 'fulfilled';
  const query = `
    UPDATE food_requests
    SET 
      status = $1,
      fulfilled_at = ${isFulfilled ? 'CURRENT_TIMESTAMP' : 'fulfilled_at'},
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING *;
  `;
  const result = await db.query(query, [status, id]);
  return result.rows[0];
};

const updateReceiptPhoto = async (id, receipt_photo_url) => {
  const query = `
    UPDATE food_requests
    SET 
      receipt_photo_url = $1,
      status = 'fulfilled',
      fulfilled_at = CURRENT_TIMESTAMP,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING *;
  `;
  const result = await db.query(query, [receipt_photo_url, id]);
  return result.rows[0];
};

const deleteFoodRequest = async (id) => {
  const query = `
    DELETE FROM food_requests 
    WHERE id = $1 
    RETURNING *;
  `;
  const result = await db.query(query, [id]);
  return result.rows[0];
};

module.exports = {
  createFoodRequest,
  findById,
  findExistingRequest,
  findByReceiverId,
  findIncomingForDonor,
  findByPickupCode,
  updateStatus,
  updateReceiptPhoto,
  deleteFoodRequest
};

