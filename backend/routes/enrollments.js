const express = require('express');
const mongoose = require('mongoose');
const Student = require('../models/Student');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const HttpError = require('../utils/httpError');

const router = express.Router();

// GET /api/enrollments?courseId=CIS%203339 — list enrollments, optionally for one course
router.get('/', async (req, res) => {
    const filter = {};
    if (typeof req.query.courseId === 'string' && req.query.courseId.trim()) {
        const course = await Course.findOne({ courseId: Course.normalizeCourseId(req.query.courseId) });
        if (!course) {
            throw new HttpError(404, `Course ${req.query.courseId} not found`);
        }
        filter.course = course._id;
    }

    const enrollments = await Enrollment.find(filter).populate('student').populate('course').sort({ createdAt: 1 });
    res.json(enrollments);
});

// POST /api/enrollments — body: { studentId, courseId } (the student's and course's IDs, e.g. "1001" and "CIS 3339")
router.post('/', async (req, res) => {
    const { studentId, courseId } = req.body ?? {};
    if (typeof studentId !== 'string' || !studentId.trim() || typeof courseId !== 'string' || !courseId.trim()) {
        throw new HttpError(400, 'Both studentId and courseId are required');
    }

    const [student, course] = await Promise.all([
        Student.findOne({ studentId: studentId.trim() }),
        Course.findOne({ courseId: Course.normalizeCourseId(courseId) }),
    ]);
    if (!student) {
        throw new HttpError(404, `Student ${studentId} not found`);
    }
    if (!course) {
        throw new HttpError(404, `Course ${courseId} not found`);
    }

    // The unique index on (student, course) rejects duplicates with a 409
    const enrollment = await Enrollment.create({ student: student._id, course: course._id });
    await enrollment.populate(['student', 'course']);
    res.status(201).json(enrollment);
});

// DELETE /api/enrollments/:id
router.delete('/:id', async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        throw new HttpError(400, 'Invalid enrollment ID');
    }
    const enrollment = await Enrollment.findByIdAndDelete(req.params.id);
    if (!enrollment) {
        throw new HttpError(404, 'Enrollment not found');
    }
    res.json({ message: 'Enrollment removed', enrollment });
});

module.exports = router;
