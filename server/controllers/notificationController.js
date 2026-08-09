const notificationModel = require('../models/notificationModel');

/**
 * Notification Controller handles fetching and managing in-app notifications
 */

const getMyNotifications = async (req, res, next) => {
  try {
    // TODO: implement logic
    return res.status(200).json({ message: 'User notifications (scaffold)', data: [] });
  } catch (error) {
    next(error);
  }
};

const markNotificationRead = async (req, res, next) => {
  try {
    // TODO: implement logic
    return res.status(200).json({ message: 'Notification marked as read (scaffold)' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyNotifications,
  markNotificationRead
};
