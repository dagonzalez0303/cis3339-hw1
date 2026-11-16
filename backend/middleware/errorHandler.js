const HttpError = require('../utils/httpError');

const DUPLICATE_MESSAGES = {
    studentId: 'A student with that ID already exists',
    courseId: 'A course with that ID already exists',
    student: 'This student is already enrolled in this course',
};

function notFound(req, res, next) {
    next(new HttpError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

// Converts every error into a JSON response with an appropriate HTTP status code
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
    if (err instanceof HttpError) {
        return res.status(err.status).json({ error: err.message });
    }

    // Mongoose schema validation failed
    if (err.name === 'ValidationError') {
        const fields = Object.fromEntries(
            Object.entries(err.errors).map(([field, error]) => [field, error.message])
        );
        return res.status(400).json({ error: Object.values(fields)[0], fields });
    }

    // Unique index violation
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern || {})[0];
        return res.status(409).json({ error: DUPLICATE_MESSAGES[field] || 'Duplicate record' });
    }

    if (err.name === 'CastError') {
        return res.status(400).json({ error: `Invalid value for ${err.path}` });
    }

    // Malformed JSON request body
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ error: 'Request body must be valid JSON' });
    }

    // Database unreachable
    if (/ServerSelection|MongoNetwork/.test(err.name) || /buffering timed out/.test(err.message)) {
        console.error('Database unavailable:', err.message);
        return res.status(503).json({ error: 'Database is unavailable. Please try again later.' });
    }

    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
}

module.exports = { notFound, errorHandler };
