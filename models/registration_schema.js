const mongoose = require('mongoose');

const RegistrationSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'students',
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'courses',
        required: true
    },
    registrationDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['Registered', 'Rejected'],
        default: 'pending'
    }
});

module.exports = mongoose.model('registration', RegistrationSchema);