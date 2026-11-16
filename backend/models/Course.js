const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
    {
        courseId: {
            type: String,
            required: [true, 'Course ID is required'],
            trim: true,
            uppercase: true,
            unique: true,
            maxlength: [20, 'Course ID must be 20 characters or fewer'],
            // Collapse repeated spaces so "CIS  3339" and "CIS 3339" are treated as duplicates
            set: (value) => (typeof value === 'string' ? value.replace(/\s+/g, ' ') : value),
        },
        name: {
            type: String,
            required: [true, 'Course name is required'],
            trim: true,
            maxlength: [150, 'Course name must be 150 characters or fewer'],
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Course', courseSchema);
