const express = require('express');
const router = express.Router();
const RegistrationController = require('../../controllers/course_registration_controller');
const { protectAdmin, admin } = require('../../middleware/authenticate');

// Get all registrations / register for course
router.route('/')
    .get(protectAdmin, admin, RegistrationController.getAllRegistrations)
    .post(protectAdmin, RegistrationController.registerCourse);

// Get student's registrations
router.get('/me-student', protectAdmin, RegistrationController.getStudentRegistrations);

// Update or drop registration
router.route('/:id')
    .put(protectAdmin, admin, RegistrationController.updateRegistrationStatus)
    .delete(protectAdmin, RegistrationController.dropCourseRegistration);

module.exports = router;