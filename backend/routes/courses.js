const express = require('express');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const HttpError = require('../utils/httpError');

const router = express.Router();

async function findCourseOr404(courseId) {
    const course = await Course.findOne({ courseId: Course.normalizeCourseId(courseId) });
    if (!course) {
        throw new HttpError(404, `Course ${courseId} not found`);
    }
    return course;
}

// GET /api/courses
router.get('/', async (req, res) => {
    res.json(await Course.find().sort({ courseId: 1 }));
});

// GET /api/courses/:courseId
router.get('/:courseId', async (req, res) => {
    res.json(await findCourseOr404(req.params.courseId));
});

// GET /api/courses/:courseId/students — roster of students enrolled in the course
router.get('/:courseId/students', async (req, res) => {
    const course = await findCourseOr404(req.params.courseId);
    const enrollments = await Enrollment.find({ course: course._id }).populate('student');
    const students = enrollments
        .map((enrollment) => enrollment.student)
        .filter(Boolean)
        .sort((a, b) => a.name.localeCompare(b.name));
    res.json({ course, students });
});

// POST /api/courses — body: { courseId, name }
router.post('/', async (req, res) => {
    const { courseId, name } = req.body ?? {};
    const course = await Course.create({ courseId, name });
    res.status(201).json(course);
});

// DELETE /api/courses/:courseId — also removes the course's enrollments
router.delete('/:courseId', async (req, res) => {
    const course = await findCourseOr404(req.params.courseId);
    const { deletedCount } = await Enrollment.deleteMany({ course: course._id });
    await course.deleteOne();
    res.json({ message: `Deleted course ${course.courseId}`, course, enrollmentsRemoved: deletedCount });
});

module.exports = router;
