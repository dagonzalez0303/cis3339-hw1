require('dotenv').config({ path: require('path').join(__dirname, '.env'), quiet: true });

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const Student = require('./models/Student');
const studentRoutes = require('./routes/students');
const courseRoutes = require('./routes/courses');
const enrollmentRoutes = require('./routes/enrollments');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();
app.use(cors());
app.use(express.json());

// REST API
app.use('/api/students', studentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api', notFound);

// Legacy endpoints used by the old HTML frontend; removed when the Vue frontend replaces it

function toLegacyStudent(student) {
    return { name: student.name, id: student.studentId, phone: student.phone, zip: student.zip };
}

// Endpoint to search for a student by name
app.post('/find-student', async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).send({ error: 'Student name is required' });
        }

        const student = await Student.findOne({ name });
        if (!student) {
            return res.status(404).send({ error: 'Student not found' });
        }

        res.send(toLegacyStudent(student));
    } catch (error) {
        console.error('Error finding student:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
});

// Endpoint to save a student
app.post('/add-student', async (req, res) => {
    try {
        const { name, id, phone, zip } = req.body;
        if (!name || !id || !phone || !zip) {
            return res.status(400).send({ error: 'All fields (name, id, phone, zip) are required' });
        }

        const student = await Student.create({ name, studentId: String(id), phone, zip });
        res.status(201).send({ message: 'Student added successfully', student: toLegacyStudent(student) });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).send({ error: 'A student with that ID already exists' });
        }
        if (error.name === 'ValidationError') {
            return res.status(400).send({ error: Object.values(error.errors)[0].message });
        }
        console.error('Error adding student:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
});

// Endpoint to delete a student by name
app.post('/delete-student', async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).send({ error: 'Student name is required' });
        }

        const student = await Student.findOneAndDelete({ name });
        if (!student) {
            return res.status(404).send({ error: 'Student not found' });
        }

        res.send({ message: 'Student deleted successfully', student: toLegacyStudent(student) });
    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

connectDB(process.env.MONGODB_URI)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Failed to connect to MongoDB:', error.message);
        console.error('Make sure MongoDB Community Edition is running and MONGODB_URI in backend/.env is correct.');
        process.exit(1);
    });
