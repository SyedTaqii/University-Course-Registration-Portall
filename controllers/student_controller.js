const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Student = require('../models/students_schema');

async function studentLogin(req, res) {
    const { rollNumber } = req.body;
    try {
        const student = await Student.findOne({ rollNumber });
        if (!student) return res.status(401).json({ message: 'Student not found or Invalid Roll Number' });
        const token = jwt.sign({ id: student._id, role: 'student' }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({
            success: true,
            token,
            student: {
                _id: student._id,
                name: student.name,
                rollNumber: student.rollNumber
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// student Profile (Protected Route)
async function studentProfile(req, res) {
    try {
        const student = await Student.findById(req.Student.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json(student);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    studentLogin,
    studentProfile
};