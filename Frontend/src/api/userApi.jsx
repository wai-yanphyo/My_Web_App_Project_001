const API_BASE_URL = 'http://localhost:5000/api';

export const fetchAllUsers = async (token) => {
    const response = await fetch(`${API_BASE_URL}/users`, {
        headers: {
               headers: { 'Content-Type': 'application/json' },
            'Authorization': `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch users');
    }
    return response.json();
};


export const updateUserRole = async (id, newRole, token) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}/role`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user role');
    }
    return response.json();
};




