const express = require('express');
const router = express.Router();
const StudentController = require('../../controllers/student_controller');
const AdminController = require('../../controllers/admin_controller');
const { protectAdmin, admin } = require('../../middleware/authenticate');


// Admin login
router.post('/admin/login', AdminController.adminLogin);

// Get admin profile
router.get('/admin/profile', protectAdmin, admin, AdminController.adminProfile);

router.post('/create-student', protectAdmin, admin, AdminController.createStudent);

router.post('/create-admin', protectAdmin, admin, AdminController.adminRegister);

module.exports = router;