const mongoose = require('mongoose');

const url = "mongodb://127.0.0.1:27017/UniversityPortal";

const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGO_URI}course_registration?retryWrites=true&w=majority`)
            .then(() => {
                console.log('MongoDB connected');
            });
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};

module.exports = connectDB;