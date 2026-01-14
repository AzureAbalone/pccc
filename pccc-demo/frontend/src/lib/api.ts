import ky from 'ky';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Create a pre-configured ky instance for API calls
export const api = ky.create({
    prefixUrl: API_URL,
    timeout: 60000, // 60 second timeout for AI responses
    retry: {
        limit: 2,
        methods: ['get'],
        statusCodes: [408, 413, 429, 500, 502, 503, 504],
    },
    hooks: {
        beforeError: [
            async (error) => {
                const { response } = error;
                if (response) {
                    try {
                        const body = await response.json() as { message?: string };
                        if (body.message) {
                            error.message = body.message;
                        }
                    } catch {
                        // Response is not JSON, use default error
                    }
                }
                return error;
            }
        ]
    }
});

export default api;
