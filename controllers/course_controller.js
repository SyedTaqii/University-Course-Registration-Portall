const Course = require('../models/courses_schema');
const Student = require('../models/students_schema');
const Admin = require('../models/admin_schema');

async function createCourse(req, res) {
    try {
        const { courseCode, title, department, level, creditHours, totalSeats, availableSeats, schedule, prerequisites } = req.body;
        const newCourse = new Course({
            courseCode,
            title,
            department,
            level,
            creditHours,
            totalSeats,
            availableSeats: totalSeats,
            schedule,
            prerequisites
        });

        const course = await newCourse.save();
        res.status(201).json({ success: true, course });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }

}

async function updateCourse(req, res) {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const { courseCode, title, department, level, creditHours, totalSeats, availableSeats, schedule, prerequisites } = req.body;
        course.courseCode = courseCode;
        course.title = title;
        course.department = department;
        course.level = level;
        course.creditHours = creditHours;
        course.totalSeats = totalSeats;
        course.availableSeats = availableSeats;
        course.schedule = schedule;
        course.prerequisites = prerequisites;

        await course.save();
        res.status(200).json({ success: true, course });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function deleteCourse(req, res) {
    try {
        const course = await Course.findById(req.params.id);
        if (course) {
            await course.remove();
            res.status(200).json({ success: true, message: 'Course deleted successfully' });
        }
        else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getAllCourses(req, res) {
    try {
        const { department, level, creditHours, availableSeats } = req.query;
        let filter = {};

        if (department) {
            filter.department = department;
        }
        if (level) {
            filter.level = level;
        }
        if (creditHours) {
            filter.creditHours = creditHours;
        }
        if (availableSeats) {
            filter.availableSeats = { $gte: availableSeats };
        }

        const courses = await Course.find(filter).populate('prerequisites');
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getCourseById(req, res) {
    try {
        const course = await Course.findById(req.params.id).populate('prerequisites');
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function subscribeCourseNotification(req, res) {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ success: false, error: 'Course not found' });
        }

        // Check if user is already subscribed
        if (course.subscribers.includes(req.Student._id)) {
            return res.status(400).json({ success: false, error: 'Already subscribed to this course' });
        }

        // Add user to subscribers
        course.subscribers.push(req.Student._id);
        await course.save();

        res.json({ success: true, message: 'Subscribed to course successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

module.exports = { createCourse, updateCourse, deleteCourse, getCourseById, getAllCourses, subscribeCourseNotification };