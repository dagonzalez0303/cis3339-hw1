// Thin wrapper around fetch for the Express REST API.
// Every failure is thrown as an ApiError with a user-friendly message.

export class ApiError extends Error {
    constructor(message, status = 0, fields = {}) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.fields = fields;
    }
}

async function request(method, path, body) {
    let response;
    try {
        response = await fetch(`/api${path}`, {
            method,
            headers: body ? { 'Content-Type': 'application/json' } : undefined,
            body: body ? JSON.stringify(body) : undefined,
        });
    } catch {
        throw new ApiError('Cannot reach the server. Make sure the backend is running.');
    }

    const data = await response.json().catch(() => null);
    if (!response.ok) {
        throw new ApiError(data?.error || `Request failed (${response.status})`, response.status, data?.fields);
    }
    return data;
}

export const api = {
    get: (path) => request('GET', path),
    post: (path, body) => request('POST', path, body),
    delete: (path) => request('DELETE', path),
};
