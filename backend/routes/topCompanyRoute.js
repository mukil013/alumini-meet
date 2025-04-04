const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');

// Public routes
router.get('/companies', companyController.getAllCompanies);
router.get('/companies/:id/alumni', companyController.getCompanyAlumni);
router.get('/alumni-users', companyController.getAlumniUsers);

// Unprotected admin endpoints
router.post('/companies', companyController.createCompany);
router.put('/companies/:id', companyController.updateCompany);
router.delete('/companies/:id', companyController.deleteCompany);

// Open comment system
router.post('/companies/:companyId/comments', companyController.addComment);

module.exports = router;