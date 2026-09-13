const foodRequestModel = require('../models/foodRequestModel');
const foodPostModel = require('../models/foodPostModel');
const crypto = require('crypto');

/**
 * Helper: Generate unique uppercase 6-digit alphanumeric pickup code (e.g. SM-849201)
 */
const generatePickupCode = () => {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // exclude ambiguous characters like 0, O, 1, I
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `SM-${code}`;
};

/**
 * FoodRequest Controller handles food requests submitted by receivers/NGOs
 */

const createFoodRequest = async (req, res, next) => {
  try {
    const { food_post_id, is_anonymous, requested_quantity, notes } = req.body;
    const receiver_id = req.user.id;

    if (!food_post_id) {
      return res.status(400).json({ message: 'Food post ID is required' });
    }

    // Verify food post exists
    const foodPost = await foodPostModel.getFoodPostById(food_post_id);
    if (!foodPost) {
      return res.status(404).json({ message: 'Food post not found' });
    }

    // Prevent requesting own food post
    if (foodPost.donor_id === receiver_id) {
      return res.status(400).json({ message: 'You cannot request your own food post' });
    }

    // Check if receiver already has an active request for this post
    const existing = await foodRequestModel.findExistingRequest(food_post_id, receiver_id);
    if (existing) {
      return res.status(400).json({
        message: 'You already have an active request for this food post',
        data: existing
      });
    }

    // Generate unique pickup code
    let pickupCode = generatePickupCode();
    let isUnique = false;
    let attempts = 0;
    while (!isUnique && attempts < 5) {
      const codeCheck = await foodRequestModel.findByPickupCode(pickupCode);
      if (!codeCheck) {
        isUnique = true;
      } else {
        pickupCode = generatePickupCode();
        attempts++;
      }
    }

    const newRequest = await foodRequestModel.createFoodRequest({
      food_post_id,
      receiver_id,
      is_anonymous: Boolean(is_anonymous),
      pickup_code: pickupCode,
      requested_quantity: requested_quantity ? parseInt(requested_quantity, 10) : 1,
      notes: notes || ''
    });

    return res.status(201).json({
      message: 'Food request submitted successfully!',
      data: newRequest
    });
  } catch (error) {
    next(error);
  }
};

const getMyFoodRequests = async (req, res, next) => {
  try {
    const receiverId = req.user.id;
    const requests = await foodRequestModel.findByReceiverId(receiverId);
    return res.status(200).json({
      message: 'Food requests retrieved successfully',
      data: requests
    });
  } catch (error) {
    next(error);
  }
};

const getIncomingFoodRequests = async (req, res, next) => {
  try {
    const donorId = req.user.id;
    const requests = await foodRequestModel.findIncomingForDonor(donorId);
    return res.status(200).json({
      message: 'Incoming food requests retrieved successfully',
      data: requests
    });
  } catch (error) {
    next(error);
  }
};

const updateFoodRequestStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['requested', 'approved', 'fulfilled', 'rejected', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid request status' });
    }

    const existingRequest = await foodRequestModel.findById(id);
    if (!existingRequest) {
      return res.status(404).json({ message: 'Food request not found' });
    }

    // Auth check: donor, receiver, or super_admin
    const userId = req.user.id;
    const userRole = req.user.role;
    const isDonor = existingRequest.donor_id === userId;
    const isReceiver = existingRequest.receiver_id === userId;
    const isAdmin = userRole === 'super_admin' || userRole === 'admin';

    if (!isDonor && !isReceiver && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to update this food request' });
    }

    const updatedRequest = await foodRequestModel.updateStatus(id, status);
    return res.status(200).json({
      message: `Food request status updated to ${status}`,
      data: updatedRequest
    });
  } catch (error) {
    next(error);
  }
};

const verifyPickupCode = async (req, res, next) => {
  try {
    const { pickup_code } = req.body;
    if (!pickup_code) {
      return res.status(400).json({ message: 'Pickup code is required' });
    }

    const request = await foodRequestModel.findByPickupCode(pickup_code.trim());
    if (!request) {
      return res.status(404).json({ message: 'Invalid pickup code. No matching request found.' });
    }

    // Auth check: post owner or super admin
    const userId = req.user.id;
    const userRole = req.user.role;
    if (request.donor_id !== userId && userRole !== 'super_admin' && userRole !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to verify pickup code for this food post' });
    }

    if (request.status === 'fulfilled') {
      return res.status(400).json({ message: 'This pickup code has already been used and fulfilled.' });
    }

    const updatedRequest = await foodRequestModel.updateStatus(request.id, 'fulfilled');
    return res.status(200).json({
      message: '🎉 Pickup code verified successfully! Food status updated to Fulfilled.',
      data: updatedRequest
    });
  } catch (error) {
    next(error);
  }
};

const uploadReceiptPhoto = async (req, res, next) => {
  try {
    const { id } = req.params;
    const request = await foodRequestModel.findById(id);
    if (!request) {
      return res.status(404).json({ message: 'Food request not found' });
    }

    // Check authorization: receiver or donor or admin
    const userId = req.user.id;
    const userRole = req.user.role;
    if (request.receiver_id !== userId && request.donor_id !== userId && userRole !== 'super_admin' && userRole !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to upload proof of receipt for this request' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Please attach a proof of receipt image file' });
    }

    const receiptPhotoUrl = `/uploads/receipts/${req.file.filename}`;
    const updatedRequest = await foodRequestModel.updateReceiptPhoto(id, receiptPhotoUrl);

    return res.status(200).json({
      message: '📷 Proof of receipt photo uploaded successfully!',
      data: updatedRequest
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createFoodRequest,
  getMyFoodRequests,
  getIncomingFoodRequests,
  updateFoodRequestStatus,
  verifyPickupCode,
  uploadReceiptPhoto
};

