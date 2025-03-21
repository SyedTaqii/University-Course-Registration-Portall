const Registration = require('../models/registration_schema');
const Course = require('../models/courses_schema');
const Student = require('../models/students_schema');
const Admin = require('../models/admin_schema');

async function registerCourse(req, res) {
    try {
        const { courseId } = req.body;
        const studentId = req.Student._id;

        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const course = await Course.findById(courseId).populate('prerequisites');
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const existingRegistration = await Registration.findOne({ student: studentId, course: courseId });
        if (existingRegistration) {
            return res.status(400).json({ message: 'Student is already registered for this course' });
        }

        if (course.availableSeats <= 0) {
            return res.status(400).json({ message: 'No available seats in the course' });
        }

        // Check for schedule conflicts
        const studentCourses = await Course.find({ _id: { $in: student.registeredCourses } });
        for (const registeredCourse of studentCourses) {
            for (const day of course.schedule.days) {
                if (registeredCourse.schedule.days.includes(day) &&
                    registeredCourse.schedule.startTime < course.schedule.endTime &&
                    registeredCourse.schedule.endTime > course.schedule.startTime) {
                    return res.status(400).json({ message: 'Course schedule conflicts with another registered course' });
                }
            }
        }

        // Check for prerequisites
        for (const prerequisite of course.prerequisites) {
            if (!student.registeredCourses.includes(prerequisite._id)) {
                return res.status(400).json({ message: `Missing prerequisite: ${prerequisite.title}` });
            }
        }

        // Create a new registration
        const registration = new Registration({
            student: studentId,
            course: courseId,
            status: 'Registered'
        });

        // Save the registration
        await registration.save();

        // Update the course's available seats
        course.availableSeats -= 1;
        await course.save();

        // Add the registration to the student's registered courses
        student.registeredCourses.push(registration._id);
        await student.save();

        res.status(201).json({ message: 'Course registration successful', registration });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}

async function getAllRegistrations(req, res) {
    try {
        const registrations = await Registration.find()
            .populate('student', 'name rollNumber')
            .populate('course', 'title courseCode');
        res.status(200).json(registrations);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}

async function getStudentRegistrations(req, res) {
    try {
        const studentId = req.Student.id;
        const registrations = await Registration.find({ student: studentId })
            .populate('course', 'title courseCode');
        res.status(200).json(registrations);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}

async function updateRegistrationStatus(req, res) {
    try {
        const { courseId } = req.body;
        const studentId = req.Student._id;

        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const course = await Course.findById(courseId).populate('prerequisites');
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const existingRegistration = await Registration.findOne({ student: studentId, course: courseId });
        if (existingRegistration) {
            return res.status(400).json({ message: 'Student is already registered for this course' });
        }

        if (course.availableSeats <= 0) {
            return res.status(400).json({ message: 'No available seats in the course' });
        }

        // Check for schedule conflicts
        const studentCourses = await Course.find({ _id: { $in: student.registeredCourses } });
        for (const registeredCourse of studentCourses) {
            for (const day of course.schedule.days) {
                if (registeredCourse.schedule.days.includes(day) &&
                    registeredCourse.schedule.startTime < course.schedule.endTime &&
                    registeredCourse.schedule.endTime > course.schedule.startTime) {
                    return res.status(400).json({ message: 'Course schedule conflicts with another registered course' });
                }
            }
        }

        // Check for prerequisites
        for (const prerequisite of course.prerequisites) {
            if (!student.registeredCourses.includes(prerequisite._id)) {
                return res.status(400).json({ message: `Missing prerequisite: ${prerequisite.title}` });
            }
        }

        // Create a new registration
        const registration = new Registration({
            student: studentId,
            course: courseId,
            status: 'Registered'
        });

        // Save the registration
        await registration.save();

        // Update the course's available seats
        course.availableSeats -= 1;
        await course.save();

        // Add the registration to the student's registered courses
        student.registeredCourses.push(registration._id);
        await student.save();

        res.status(201).json({ message: 'Course registration successful', registration });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}

async function getAllRegistrations(req, res) {
    try {
        const registrations = await Registration.find()
            .populate('student', 'name rollNumber')
            .populate('course', 'title courseCode');
        res.status(200).json(registrations);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}

async function getStudentRegistrations(req, res) {
    try {
        const studentId = req.Student.id;
        const registrations = await Registration.find({ student: studentId })
            .populate('course', 'title courseCode');
        res.status(200).json(registrations);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}

async function updateRegistrationStatus(req, res) {
    try {
        const { registrationId, status } = req.body;

        // Validate status
        if (!['Registered', 'Rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        // Find the registration
        const registration = await Registration.findById(registrationId).populate('course');
        if (!registration) {
            return res.status(404).json({ message: 'Registration not found' });
        }

        // Update the registration status
        const previousStatus = registration.status;
        registration.status = status;
        await registration.save();

        // Update the course's available seats if the status is changed
        const course = await Course.findById(registration.course._id);
        if (previousStatus === 'Registered' && status === 'Rejected') {
            course.availableSeats += 1;
        }
        else if (previousStatus === 'Rejected' && status === 'Registered') {
            if (course.availableSeats <= 0) {
                return res.status(400).json({ message: 'No available seats in the course' });
            }
            course.availableSeats -= 1;
        }
        await course.save();

        res.status(200).json({ message: 'Registration status updated successfully', registration });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}

async function dropCourseRegistration(req, res) {
    try {
        const { registrationId } = req.body;
        const studentId = req.Student._id;

        const registration = await Registration.findById(registrationId);
        if (!registration) {
            return res.status(404).json({ message: 'Registration not found' });
        }

        if (registration.student.toString() !== studentId) {
            return res.status(403).json({ message: 'Unauthorized action' });
        }

        const course = await Course.findById(registration.course);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        await registration.remove();

        course.availableSeats += 1;
        await course.save();

        const student = await Student.findById(studentId);
        student.registeredCourses.pull(registration._id);
        await student.save();

        res.status(200).json({ message: 'Course registration dropped successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}

module.exports = {
    registerCourse,
    getAllRegistrations,
    getStudentRegistrations,
    updateRegistrationStatus,
    dropCourseRegistration
};