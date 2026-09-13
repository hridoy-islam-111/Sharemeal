const reportModel = require('../models/reportModel');
const userModel = require('../models/userModel');

/**
 * Report Controller handles user issue reports, food safety flags, and dispute filings
 */

const normalizeReportPayload = (body = {}) => {
  const reportedUserId = Number(body.reported_user_id ?? body.reported_entity_id ?? body.reportedId ?? body.userId ?? 0);
  const reason = String(body.reason || '').trim();
  const reportedEntityType = String(body.reported_entity_type || 'user').toLowerCase();

  return {
    reportedUserId,
    reason,
    reportedEntityType
  };
};

const createReport = async (req, res, next) => {
  try {
    const reporterId = req.user?.id;
    
    if (!reporterId) {
      return res.status(401).json({ message: 'Authentication required to submit a report.' });
    }
    
    const { reportedUserId, reason, reportedEntityType } = normalizeReportPayload(req.body);

    if (!reportedUserId || Number(reportedUserId) === Number(reporterId)) {
      return res.status(400).json({ message: 'You cannot report yourself.' });
    }

    if (!reason || reason.length < 5) {
      return res.status(400).json({ message: 'Report reason must be at least 5 characters long.' });
    }

    const reportedUser = await userModel.findById(reportedUserId);
    if (!reportedUser) {
      return res.status(404).json({ message: 'User being reported was not found.' });
    }

    const report = await reportModel.createReport({
      reporter_id: reporterId,
      reported_entity_type: reportedEntityType === 'user' ? 'user' : reportedEntityType,
      reported_entity_id: reportedUserId,
      reason,
      status: 'open'
    });

    return res.status(201).json({
      message: 'Report submitted successfully.',
      report
    });
  } catch (error) {
    next(error);
  }
};

const getAllReports = async (req, res, next) => {
  try {
    const reports = await reportModel.findAll();
    return res.status(200).json({
      message: 'All reports retrieved',
      data: reports
    });
  } catch (error) {
    next(error);
  }
};

const updateReportStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const allowedStatuses = ['open', 'under_review', 'resolved', 'dismissed'];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: 'Status must be one of: open, under_review, resolved, dismissed.'
      });
    }

    const updatedReport = await reportModel.updateStatus(id, status);
    if (!updatedReport) {
      return res.status(404).json({ message: 'Report not found.' });
    }

    return res.status(200).json({
      message: 'Report status updated',
      report: updatedReport
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReport,
  getAllReports,
  updateReportStatus
};
