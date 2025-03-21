const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Admin = require('../models/admin_schema');
const Student = require('../models/students_schema');

async function adminLogin(req, res) {
    const { username, password } = req.body;
    try {
        const admin = await Admin.findOne({ username });
        if (!admin || !await bcrypt.compare(password, admin.password)) {
            return res.status(401).json({ message: 'Invalid Admin credentials' });
        }
        const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({
            success: true,
            token,
            admin: {
                _id: admin._id,
                name: admin.name,
                password: admin.password
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Admin Registration
async function adminRegister(req, res) {
    const { username, password } = req.body;
    try {
        const existingAdmin = await Admin.findOne({ username });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin username already exists' });
        }

        const newAdmin = new Admin({ username, password: password });
        await newAdmin.save();

        res.status(201).json({ success: true, message: 'Admin registered successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Admin Profile (Protected Route)
async function adminProfile(req, res) {
    try {
        const admin = await Admin.findById(req.Admin.id).select('-password');
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        res.json(admin);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function createStudent(req, res) {
    const { rollNumber, name, registeredCourses } = req.body;

    try {
        const existingStudent = await Student.findOne({ rollNumber });
        if (existingStudent) {
            return res.status(400).json({ message: 'Student with this ID already exists' });
        }

        const newStudent = new Student({
            rollNumber,
            name,
            registeredCourses,
        });

        await newStudent.save();

        res.status(201).json({ success: true, message: 'Student registered successfully', student: newStudent });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    adminLogin,
    adminRegister,
    adminProfile,
    createStudent
};
