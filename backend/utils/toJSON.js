// Shared schema option: expose `id` instead of `_id` and hide the internal `__v` field in API responses
module.exports = {
    virtuals: true,
    versionKey: false,
    transform(doc, ret) {
        delete ret._id;
        return ret;
    },
};
