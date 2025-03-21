const Student = require('../models/students_schema');
const Admin = require('../models/admin_schema');
const Course = require('../models/courses_schema');

async function populateInitialData(req, res) {
    try {
        // Check if admin exists
        const adminExists = await Admin.findOne({ username: 'admin' });

        if (!adminExists) {
            await User.create({
                username: 'admin',
                password: 'admin',
            });
        }

        // Create your student account
        const studentExists = await Student.findOne({ rollNumber: '22F-3708' });

        if (!studentExists) {
            await User.create({
                rollNumber: '22F-3708',
                name: 'Syed Muhammad Taqi',
                password: '3708',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Database seeded successfully with initial users'
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

module.exports = {
    populateInitialData
};