// An error with an HTTP status code that the error handler can send to the client as-is
class HttpError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}

module.exports = HttpError;
