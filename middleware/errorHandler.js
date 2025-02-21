// middleware/errorHandler.js
export function handleApiError(error, req, res) {
    console.error('API Error:', error);

    if (error.code === '23505') { // Unique violation
        return {
            error: 'User already exists',
            status: 409
        };
    }

    if (error.code === '23502') { // Not null violation
        return {
            error: 'Missing required fields',
            status: 400
        };
    }

    return {
        error: 'Internal server error',
        status: 500
    };
}