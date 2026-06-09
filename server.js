const express = require('express');
const dotenv = require('dotenv');
const connectDatabase = require('./Database/database');
dotenv.config();
const app = express();
const cors = require("cors");

app.use(express.json());

// 1. FIX: Pass an array of allowed strings instead of using the || operator
const allowedOrigins = [
  "http://localhost:5173", 
  "https://gorgeous-pastelito-4b421c.netlify.app",
  "https://mvwdar.netlify.app" // Added this based on your previous error log
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps, curl, or server-to-server)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true // Set to true if you plan to send cookies or authorization headers
}));

app.use(require('./modules/students/students.route'));
app.use(require('./modules/classes/classes.route'));
app.use(require('./modules/teachers/teachers.route'));
app.use(require('./modules/scores/scores.route'));
app.use(require('./modules/payments/payments.route'));
app.use(require('./modules/Attendance/attendance.route'));
app.use(require('./modules/subjects/subjects.route'));
app.use(require('./modules/schedules/schedules.route'));
app.use(require('./modules/announcements/announcements.route'));
app.use(require('./modules/users/users.route'));

// 2. FIX: Express error handlers require 4 arguments (err, req, res, next) 
// to be recognized properly by Express, otherwise 'res' will be undefined.
app.use((err, req, res, next) => {
    res.status(500).send({ error: err.message });
});

connectDatabase();
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "School API is running"
  });
});
// 3. FIX: Changed '3000 || PORT' to 'process.env.PORT || 3000'
// Deployed platforms (like Render/Railway) assign dynamic ports via process.env.PORT.
// Hardcoding 3000 first will make the deployment fail online.
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});