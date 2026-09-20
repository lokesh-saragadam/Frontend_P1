const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api').replace(/\/$/, '');

export async function apiRequest(path, { token, body, method = 'GET', signal } = {}) {
    let response;
    try {
        response = await fetch(API_BASE + path, {
            method, signal,
            headers: {
                ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            ...(body !== undefined ? { body: JSON.stringify(body) } : {})
        });
    } catch (error) {
        if (error.name === 'AbortError') throw error;
        throw new Error('Unable to reach the server. Check your connection and try again.');
    }
    let responseBody;
    try {
        responseBody = await response.json();
    } catch {
        if (signal?.aborted) throw new DOMException('Request cancelled', 'AbortError');
        throw new Error('The server returned an unexpected response. Please try again.');
    }
    if (!response.ok) {
        const requestReference = response.status >= 500 && /^[a-f0-9-]{36}$/i.test(responseBody.requestId || '')
            ? ` Reference: ${responseBody.requestId}` : '';
        const error = new Error((responseBody.message || 'The request failed. Please try again.') + requestReference);
        error.status = response.status;
        error.code = responseBody.code;
        error.requestId = responseBody.requestId;
        throw error;
    }
    return responseBody;
}
