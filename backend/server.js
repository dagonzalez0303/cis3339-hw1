const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '.env'), quiet: true });

const express = require('express');
const connectDB = require('./config/db');
const studentRoutes = require('./routes/students');
const courseRoutes = require('./routes/courses');
const enrollmentRoutes = require('./routes/enrollments');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const DIST_DIR = path.join(__dirname, '..', 'frontend', 'dist');
const INDEX_HTML = path.join(DIST_DIR, 'index.html');

const app = express();
app.use(express.json());

// REST API
app.use('/api/students', studentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api', notFound);

// Production frontend: serve the Vue build output (hashed assets can be cached long-term)
app.use(
    express.static(DIST_DIR, {
        setHeaders(res, filePath) {
            if (filePath.includes(`${path.sep}assets${path.sep}`)) {
                res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
            }
        },
    })
);

// Client-side routes (/students, /courses, ...) all load index.html so a page refresh never 404s
app.get('/{*path}', (req, res) => {
    // A missing file (e.g. /assets/old.js) is a real 404, not an app route
    if (path.extname(req.path)) {
        return res.status(404).type('text').send('Not found');
    }
    if (!fs.existsSync(INDEX_HTML)) {
        return res.status(503).type('text').send('Frontend has not been built yet. Run "npm run build" first.');
    }
    res.sendFile(INDEX_HTML);
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
