const db = require('../config/db');

/**
 * Notification Model - database operations for notifications table
 */

const createNotification = async (notificationData) => {
  // TODO: implement query
};

const findById = async (id) => {
  // TODO: implement query
};

const findByUserId = async (userId) => {
  // TODO: implement query
};

const markAsRead = async (id) => {
  // TODO: implement query
};

const deleteNotification = async (id) => {
  // TODO: implement query
};

module.exports = {
  createNotification,
  findById,
  findByUserId,
  markAsRead,
  deleteNotification
};
