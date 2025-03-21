const express = require('express');
const router = express.Router();
const CourseController = require('../../controllers/course_controller');
const { protectAdmin, admin } = require('../../middleware/authenticate');

// Get all courses / create new course
router.route('/')
    .get(CourseController.getAllCourses)
    .post(protectAdmin, admin, CourseController.createCourse);

// Get, update, delete course by ID
router.route('/:id')
    .get(CourseController.getCourseById)
    .put(protectAdmin, admin, CourseController.updateCourse)
    .delete(protectAdmin, admin, CourseController.deleteCourse);

// Subscribe to course notifications
// router.post('/:id/subscribe', protect, courseController.subscribeToCourse);

module.exports = router;