const API_BASE_URL = 'http://localhost:5000/api';

export const createComment = async (commentData, token) => {
    const response = await fetch(`${API_BASE_URL}/comments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(commentData),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit comment and rating');
    }
    return response.json();
};


export const fetchCommentsForProperty = async (propertyId) => {
    const response = await fetch(`${API_BASE_URL}/comments/property/${propertyId}`);
    if (!response.ok) {
        throw new Error('Failed to fetch comments for property');
    }
    return response.json();
};
