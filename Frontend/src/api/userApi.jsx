const API_BASE_URL = 'http://localhost:5000/api';

export const fetchAllUsers = async (token) => {
    const response = await fetch(`${API_BASE_URL}/users`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch users');
    }
    return response.json();
};




