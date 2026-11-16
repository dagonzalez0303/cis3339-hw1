const mongoose = require('mongoose');
const toJSON = require('../utils/toJSON');

// "  cis   3339 " -> "CIS 3339", so equivalent course IDs are treated as duplicates
function normalizeCourseId(value) {
    return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ').toUpperCase() : value;
}

const courseSchema = new mongoose.Schema(
    {
        courseId: {
            type: String,
            required: [true, 'Course ID is required'],
            unique: true,
            maxlength: [20, 'Course ID must be 20 characters or fewer'],
            set: normalizeCourseId,
        },
        name: {
            type: String,
            required: [true, 'Course name is required'],
            trim: true,
            maxlength: [150, 'Course name must be 150 characters or fewer'],
        },
    },
    { timestamps: true, toJSON }
);

courseSchema.statics.normalizeCourseId = normalizeCourseId;

module.exports = mongoose.model('Course', courseSchema);
