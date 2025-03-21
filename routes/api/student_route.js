const express = require('express');
const router = express.Router();
const StudentController = require('../../controllers/student_controller');
const AdminController = require('../../controllers/admin_controller');
const { protectStudent } = require('../../middleware/authenticate');

// Student login
router.post('/student/login', StudentController.studentLogin);

// Get student profile
router.get('/student/profile', protectStudent, StudentController.studentProfile);

module.exports = router;