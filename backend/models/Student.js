const mongoose = require('mongoose');
const toJSON = require('../utils/toJSON');

const studentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            maxlength: [100, 'Name must be 100 characters or fewer'],
        },
        studentId: {
            type: String,
            required: [true, 'Student ID is required'],
            trim: true,
            unique: true,
            match: [/^\d{1,10}$/, 'Student ID must be 1-10 digits'],
        },
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            trim: true,
            match: [/^[\d\s()+-]{7,20}$/, 'Phone number must be 7-20 digits, spaces, or dashes'],
        },
        zip: {
            type: String,
            required: [true, 'ZIP code is required'],
            trim: true,
            match: [/^\d{5}(-\d{4})?$/, 'ZIP code must be 5 digits (or ZIP+4)'],
        },
    },
    { timestamps: true, toJSON }
);

studentSchema.index({ name: 1 });

module.exports = mongoose.model('Student', studentSchema);
