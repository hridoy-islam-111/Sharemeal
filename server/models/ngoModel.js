const db = require('../config/db');

/**
 * NGO Model - database operations for ngos table
 */

const createNgoProfile = async (ngoData) => {
  // TODO: implement query
};

const findById = async (id) => {
  // TODO: implement query
};

const findByUserId = async (userId) => {
  // TODO: implement query
};

const findPendingVerification = async () => {
  // TODO: implement query
};

const updateVerificationStatus = async (id, status) => {
  // TODO: implement query
};

const updateNgoProfile = async (id, updateData) => {
  // TODO: implement query
};

const deleteNgoProfile = async (id) => {
  // TODO: implement query
};

module.exports = {
  createNgoProfile,
  findById,
  findByUserId,
  findPendingVerification,
  updateVerificationStatus,
  updateNgoProfile,
  deleteNgoProfile
};
