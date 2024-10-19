const express = require('express');
const { registerCompany, loginCompany } = require('../controllers/companyController');
const router = express.Router();

// POST /api/companies/register
router.post('/register', registerCompany);

// POST /api/companies/login
router.post('/login', loginCompany);

module.exports = router;
