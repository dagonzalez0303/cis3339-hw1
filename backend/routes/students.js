const express = require('express');
const Student = require('../models/Student');
const Enrollment = require('../models/Enrollment');
const HttpError = require('../utils/httpError');

const router = express.Router();

function escapeRegex(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function findStudentOr404(studentId) {
    const student = await Student.findOne({ studentId: studentId.trim() });
    if (!student) {
        throw new HttpError(404, `Student ${studentId} not found`);
    }
    return student;
}

// GET /api/students?search=term — list students, optionally filtered by partial name or exact student ID
router.get('/', async (req, res) => {
    const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
    const filter = search
        ? { $or: [{ name: { $regex: escapeRegex(search), $options: 'i' } }, { studentId: search }] }
        : {};

    const students = await Student.find(filter).sort({ name: 1 });
    res.json(students);
});

// GET /api/students/:studentId
router.get('/:studentId', async (req, res) => {
    res.json(await findStudentOr404(req.params.studentId));
});

// POST /api/students — body: { name, studentId, phone, zip }
router.post('/', async (req, res) => {
    const { name, studentId, phone, zip } = req.body ?? {};
    const student = await Student.create({ name, studentId, phone, zip });
    res.status(201).json(student);
});

// DELETE /api/students/:studentId — also removes the student's enrollments
router.delete('/:studentId', async (req, res) => {
    const student = await findStudentOr404(req.params.studentId);
    const { deletedCount } = await Enrollment.deleteMany({ student: student._id });
    await student.deleteOne();
    res.json({ message: `Deleted student ${student.name}`, student, enrollmentsRemoved: deletedCount });
});

module.exports = router;
