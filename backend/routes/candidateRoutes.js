const express = require('express');
const { applyToJob, getCandidatesForJob } = require('../controllers/candidateController'); // Ensure these are correctly imported
const router = express.Router();

// POST /api/candidates/apply
router.post('/apply', applyToJob);  // This route should work if the function is correctly imported

// GET /api/candidates/job/:jobId
router.get('/job/:jobId', getCandidatesForJob);  // Check if this function is correctly defined in the controller

module.exports = router;
