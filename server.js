const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
connectDB();

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
    const originalSend = res.send;
    res.send = function (body) {
        console.log('Response:', JSON.stringify(body, null, 2));
        originalSend.call(this, body);
    };
    next();
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Set the view engine to EJS
app.set('view engine', 'ejs');

const StudentRoutes = require('./routes/api/student_route');
const AdminRoutes = require('./routes/api/admin_route');
const CourseRoutes = require('./routes/api/courses_route');
const RegistrationRoutes = require('./routes/api/registration_route');
const ReportRoutes = require('./routes/api/report_route');
const InitialDataRoutes = require('./routes/api/initial_data_route');
const MainRoute = require('./routes/main_route');

app.use('/api/student', StudentRoutes);
app.use('/api/admin', AdminRoutes);
app.use('/api/courses', CourseRoutes);
app.use('/api/registrations', RegistrationRoutes);
app.use('/api/reports', ReportRoutes);
app.use('/api/inital-data', InitialDataRoutes);
app.use('/', MainRoute);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Example route to get all students
// app.get('/students', async (req, res) => {
//     try {
//         const students = await Student.find().populate('registeredCourses');
//         res.json(students);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

// try {
//     // async function recordFriend() {
//     //     const student = new Student({
//     //         rollNumber: 3708,
//     //         name: "Taqi",
//     //     })

//     //     await student.save();
//     //     console.log("Friend Added");
//     // }
//     // recordFriend();

//     async function recordCourse() {
//         // const course = new Course({
//         //     courseCode: "101",
//         //     title: "Introduction to Computer Science",
//         //     department: (["Computer Science", "Software Engineering"]),
//         //     level: "Undergraduate",
//         //     creditHours: 1,
//         //     totalSeats: 100,
//         //     availableSeats: 100,
//         //     schedule: {
//         //         days: ["Monday", "Wednesday", "Friday"],
//         //         startTime: "10:00",
//         //         endTime: "11:00"
//         //     },
//         //     prerequisites: [],
//         //     seatsAvailable: 100,
//         //     studentsRegistered: []
//         // })

//         // const course1 = new Course({
//         //     courseCode: "102",
//         //     title: "Programming Fundamentals",
//         //     department: ["Computer Science", "Software Engineering"],
//         //     level: "Undergraduate",
//         //     creditHours: 3,
//         //     totalSeats: 100,
//         //     availableSeats: 100,
//         //     schedule: {
//         //         days: ["Tuesday", "Thursday"],
//         //         startTime: "10:00",
//         //         endTime: "11:00"
//         //     },
//         //     prerequisites: [],
//         //     seatsAvailable: 100,
//         //     studentsRegistered: []
//         // });

//         // const course2 = new Course({
//         //     courseCode: "201",
//         //     title: "Obejct Oriented Programming",
//         //     department: ["Computer Science", "Software Engineering"],
//         //     level: "Undergraduate",
//         //     creditHours: 3,
//         //     totalSeats: 100,
//         //     availableSeats: 100,
//         //     schedule: {
//         //         days: ["Monday", "Wednesday", "Friday"],
//         //         startTime: "11:00",
//         //         endTime: "12:00"
//         //     },
//         //     prerequisites: ['67dd6db14098f8e89bbc81b4'],
//         //     seatsAvailable: 100,
//         //     studentsRegistered: []
//         // });

//         // const course2 = new Course({
//         //     courseCode: "CS202",
//         //     title: "Data Structures and Algorithms",
//         //     department: ["Computer Science", "Software Engineering"],
//         //     level: "Undergraduate",
//         //     creditHours: 3,
//         //     totalSeats: 100,
//         //     availableSeats: 100,
//         //     schedule: {
//         //         days: ["Tuesday", "Thursday"],
//         //         startTime: "11:00",
//         //         endTime: "12:00"
//         //     },
//         //     prerequisites: ['67dd6ddd7941011a3b1efb8a'],
//         //     seatsAvailable: 100,
//         //     studentsRegistered: []
//         // });

//         // const course2 = new Course({
//         //     courseCode: "301",
//         //     title: "Database Management Systems",
//         //     department: ["Computer Science", "Software Engineering"],
//         //     level: "Undergraduate",
//         //     creditHours: 3,
//         //     totalSeats: 50,
//         //     availableSeats: 50,
//         //     schedule: {
//         //         days: ["Monday", "Wednesday", "Friday"],
//         //         startTime: "12:00",
//         //         endTime: "13:00"
//         //     },
//         //     prerequisites: ['67dd6df8eae15ec242b0bda5'],
//         // });

//         // const course2 = new Course({
//         //     courseCode: "401",
//         //     title: "Operating Systems",
//         //     department: ["Computer Science", "Software Engineering"],
//         //     level: "Undergraduate",
//         //     creditHours: 3,
//         //     totalSeats: 50,
//         //     availableSeats: 50,
//         //     schedule: {
//         //         days: ["Tuesday", "Thursday"],
//         //         startTime: "12:00",
//         //         endTime: "13:00"
//         //     },
//         //     prerequisites: ['67dd6df8eae15ec242b0bda5'],
//         // });

//         // const course2 = new Course({
//         //     courseCode: "302",
//         //     title: "Software Design and Architecture",
//         //     department: ["Software Engineering"],
//         //     level: "Undergraduate",
//         //     creditHours: 3,
//         //     totalSeats: 50,
//         //     availableSeats: 50,
//         //     schedule: {
//         //         days: ["Monday", "Wednesday", "Friday"],
//         //         startTime: "13:00",
//         //         endTime: "14:00"
//         //     },
//         //     prerequisites: ['67dd6ec9abb74d37e81e3f17'],
//         // });

//         // const course2 = new Course({
//         //     courseCode: "402",
//         //     title: "Software Construction and Development",
//         //     department: ["Software Engineering"],
//         //     level: "Undergraduate",
//         //     creditHours: 3,
//         //     totalSeats: 50,
//         //     availableSeats: 50,
//         //     schedule: {
//         //         days: ["Tuesday", "Thursday"],
//         //         startTime: "13:00",
//         //         endTime: "14:00"
//         //     },
//         //     prerequisites: ['67dd5d37f3fb1204e4d34cc0'],
//         // });

//         // const course2 = new Course({
//         //     courseCode: "403",
//         //     title: "Software Quality Assurance",
//         //     department: ["Software Engineering"],
//         //     level: "Undergraduate",
//         //     creditHours: 3,
//         //     totalSeats: 50,
//         //     availableSeats: 50,
//         //     schedule: {
//         //         days: ["Monday", "Wednesday", "Friday"],
//         //         startTime: "14:00",
//         //         endTime: "15:00"
//         //     },
//         //     prerequisites: ['67dd5d7f4f56fc8d2f077b80'],
//         // });

//         // await course.save();
//         // await course1.save();
//         // await course2.save();
//         console.log("Course Added");
//     }
//     recordCourse();

// async function recordAdmin() {
//     const admin = new Admin({
//         username: "admin",
//         password: "admin"
//     })

//     await admin.save();
//     console.log("Admin Added");
// }
// recordAdmin();
// } catch (error) {
//     console.log(error);
// }

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));