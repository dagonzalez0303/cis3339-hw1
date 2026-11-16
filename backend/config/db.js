const mongoose = require('mongoose');
const Student = require('../models/Student');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// Connects to MongoDB and makes sure every collection and index exists,
// so the app works against an empty or nonexistent database with no manual setup.
async function connectDB(uri) {
    if (!uri) {
        throw new Error('MONGODB_URI is not defined. Check backend/.env.');
    }

    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });

    for (const model of [Student, Course, Enrollment]) {
        await model.createCollection();
        await model.syncIndexes();
    }

    console.log(`Connected to MongoDB: ${mongoose.connection.name}`);
}

module.exports = connectDB;
