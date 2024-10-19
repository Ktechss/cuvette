const express = require('express');
const { getCompanyJobPosts, createJobPost } = require('../controllers/jobPostController');
const verifyToken = require('../middleware/verifyToken');
const router = express.Router();

// POST /api/jobPosts (protected route)
router.post('/create', verifyToken, createJobPost);
router.get('/company-jobs', verifyToken, getCompanyJobPosts);

module.exports = router;
