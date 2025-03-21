const jwt = require('jsonwebtoken');
const Student = require('../models/students_schema');
const Admin = require('../models/admin_schema');

async function protectStudent(req, res, next) {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return res.status(401).json({ success: false, error: 'Not authorized to access this route' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt');
        req.Student = await Student.findById(decoded.id);
        next();
    } catch (error) {
        return res.status(401).json({ success: false, error: 'Not authorized to access this route' });
    }
};

async function protectAdmin(req, res, next) {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return res.status(401).json({ success: false, error: 'Not authorized to access this route' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt');
        req.Admin = await Admin.findById(decoded.id);
        next();
    } catch (error) {
        return res.status(401).json({ success: false, error: 'Not authorized to access this route' });
    }
};

function admin(req, res, next) {
    if (req.Admin && req.Admin.username === 'admin') {
        next();
    } else {
        return res.status(403).json({ success: false, error: 'Not authorized as an admin' });
    }
};

module.exports = { protectStudent, protectAdmin, admin };