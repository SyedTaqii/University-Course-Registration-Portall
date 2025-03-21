const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const studentSchema = new mongoose.Schema({
    rollNumber: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    registeredCourses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'registrations'
    }],
});

// Hash password before saving
// studentSchema.pre('save', async function (next) {
//     if (!this.isModified('password')) {
//         next();
//     }

//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
// });

// // Match user entered password to hashed password in database
// studentSchema.methods.matchPassword = async function (enteredPassword) {
//     return await bcrypt.compare(enteredPassword, this.password);
// };

module.exports = mongoose.model('students', studentSchema);