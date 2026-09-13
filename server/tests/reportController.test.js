const test = require('node:test');
const assert = require('node:assert/strict');
const reportController = require('../controllers/reportController');
const reportModel = require('../models/reportModel');
const userModel = require('../models/userModel');

const makeRes = () => ({
  statusCode: null,
  body: null,
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(payload) {
    this.body = payload;
    return this;
  }
});

test('createReport rejects reporting yourself', async () => {
  const old = reportModel.createReport;
  reportModel.createReport = async () => { throw new Error('should not be called'); };

  try {
    const req = {
      user: { id: 9 },
      body: { reported_user_id: 9, reason: 'testing' }
    };
    const res = makeRes();
    const next = () => {};

    await reportController.createReport(req, res, next);

    assert.equal(res.statusCode, 400);
    assert.equal(res.body.message, 'You cannot report yourself.');
  } finally {
    reportModel.createReport = old;
  }
});

test('createReport accepts valid user reports and normalizes entity type', async () => {
  const oldReportCreate = reportModel.createReport;
  const oldUserFindById = userModel.findById;
  let called = null;

  userModel.findById = async () => ({ id: 5, role: 'donor' });
  reportModel.createReport = async (reportData) => {
    called = reportData;
    return { id: 12, ...reportData };
  };

  try {
    const req = {
      user: { id: 9 },
      body: { reported_user_id: 5, reason: 'Spam account' }
    };
    const res = makeRes();
    const next = () => {};

    await reportController.createReport(req, res, next);

    assert.equal(res.statusCode, 201);
    assert.equal(called.reported_entity_type, 'user');
    assert.equal(called.reported_entity_id, 5);
    assert.equal(called.reason, 'Spam account');
    assert.equal(called.status, 'open');
  } finally {
    reportModel.createReport = oldReportCreate;
    userModel.findById = oldUserFindById;
  }
});
