// Client-side validation that mirrors the backend schema rules,
// so users get instant feedback before a request is sent.

export function validateStudent({ name, studentId, phone, zip }) {
    const errors = {};
    if (!name.trim()) errors.name = 'Name is required';
    else if (name.trim().length > 100) errors.name = 'Name must be 100 characters or fewer';

    if (!studentId.trim()) errors.studentId = 'Student ID is required';
    else if (!/^\d{1,10}$/.test(studentId.trim())) errors.studentId = 'Student ID must be 1-10 digits';

    if (!phone.trim()) errors.phone = 'Phone number is required';
    else if (!/^[\d\s()+-]{7,20}$/.test(phone.trim())) errors.phone = 'Use 7-20 digits, spaces, or dashes';

    if (!zip.trim()) errors.zip = 'ZIP code is required';
    else if (!/^\d{5}(-\d{4})?$/.test(zip.trim())) errors.zip = 'ZIP code must be 5 digits (or ZIP+4)';

    return errors;
}

export function validateCourse({ courseId, name }) {
    const errors = {};
    if (!courseId.trim()) errors.courseId = 'Course ID is required';
    else if (courseId.trim().length > 20) errors.courseId = 'Course ID must be 20 characters or fewer';

    if (!name.trim()) errors.name = 'Course name is required';
    else if (name.trim().length > 150) errors.name = 'Course name must be 150 characters or fewer';

    return errors;
}
