const db = require('../config/db');

/**
 * Rating Model - database operations for ratings table
 */

const createRating = async (ratingData) => {
  // TODO: implement query
};

const findById = async (id) => {
  // TODO: implement query
};

const findByTargetUserId = async (targetUserId) => {
  // TODO: implement query
};

const findByAuthorId = async (authorId) => {
  // TODO: implement query
};

const updateRating = async (id, updateData) => {
  // TODO: implement query
};

const deleteRating = async (id) => {
  // TODO: implement query
};

module.exports = {
  createRating,
  findById,
  findByTargetUserId,
  findByAuthorId,
  updateRating,
  deleteRating
};
