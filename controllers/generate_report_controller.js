const Registration = require('../models/registration_schema');
const Course = require('../models/courses_schema');
const Student = require('../models/students_schema');
const Admin = require('../models/admin_schema');

async function getAllCourseRegistration(req, res) {
    try {
        const courseId = req.params.courseId;
        const registrations = await Registration.find({ course: courseId }).populate('student');
        const students = registrations.map(registration => registration.student);
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

async function getCoursesWithAvailableSeats(req, res) {
    try {
        const courses = await Course.find({ availableSeats: { $gt: 0 } });
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

async function getStudentsWithoutPrerequisites(req, res) {
    try {
        const students = await Student.find().populate('registeredCourses');
        const studentsWithoutPrerequisites = [];

        for (const student of students) {
            for (const course of student.registeredCourses) {
                const courseDetails = await Course.findById(course.course);
                const prerequisites = courseDetails.prerequisites;

                for (const prerequisite of prerequisites) {
                    const hasCompleted = student.registeredCourses.some(
                        registeredCourse => registeredCourse.course.toString() === prerequisite.toString()
                    );

                    if (!hasCompleted) {
                        studentsWithoutPrerequisites.push(student);
                        break;
                    }
                }
            }
        }

        res.status(200).json(studentsWithoutPrerequisites);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

async function getAllCourses(req, res) {
    try {
        const courses = await Course.find();
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getAllCourseRegistration,
    getCoursesWithAvailableSeats,
    getStudentsWithoutPrerequisites,
    getAllCourses
};