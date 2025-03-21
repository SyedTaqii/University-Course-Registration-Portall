const express = require('express');
const router = express.Router();
const ReportController = require('../../controllers/generate_report_controller');
const { protectAdmin, admin } = require('../../middleware/authenticate');

// Course enrollment report
router.get('/course-enrollment/:courseId', protectAdmin, admin, ReportController.getAllCourseRegistration);

// Available courses report
router.get('/available-courses', protectAdmin, admin, ReportController.getCoursesWithAvailableSeats);

// Prerequisite issues report
router.get('/prerequisite-issues', protectAdmin, admin, ReportController.getStudentsWithoutPrerequisites);

module.exports = router;