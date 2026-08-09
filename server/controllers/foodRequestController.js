const foodRequestModel = require('../models/foodRequestModel');

/**
 * FoodRequest Controller handles food requests submitted by receivers to NGOs
 */

const createFoodRequest = async (req, res, next) => {
  try {
    // TODO: implement logic
    return res.status(201).json({ message: 'Food request created (scaffold)' });
  } catch (error) {
    next(error);
  }
};

const getMyFoodRequests = async (req, res, next) => {
  try {
    // TODO: implement logic
    return res.status(200).json({ message: 'List of food requests (scaffold)', data: [] });
  } catch (error) {
    next(error);
  }
};

const getIncomingFoodRequests = async (req, res, next) => {
  try {
    // TODO: implement logic
    return res.status(200).json({ message: 'Incoming food requests for NGO (scaffold)', data: [] });
  } catch (error) {
    next(error);
  }
};

const updateFoodRequestStatus = async (req, res, next) => {
  try {
    // TODO: implement logic
    return res.status(200).json({ message: 'Food request status updated (scaffold)' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createFoodRequest,
  getMyFoodRequests,
  getIncomingFoodRequests,
  updateFoodRequestStatus
};
