const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    courseCode: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    department: {
        type: [String],
        enum: ['Computer Science', 'Software Engineering', 'Artificial Intelligence', 'Electrical Engineering'],
        required: true,
        validate: {
            validator: function (value) {
                return value.length > 0;
            },
            message: 'At least one department must be specified.'
        }
    },
    level: {
        type: String,
        required: true
    },
    creditHours: {
        type: Number,
        required: true
    },
    totalSeats: {
        type: Number,
        required: true
    },
    availableSeats: {
        type: Number,
        required: true
    },
    schedule: {
        days: [{
            type: String,
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
        }],
        startTime: String,
        endTime: String
    },
    prerequisites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'courses'
    }]
});

module.exports = mongoose.model('courses', courseSchema);