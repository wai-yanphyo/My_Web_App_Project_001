const API_BASE_URL = 'http://localhost:5000/api';

export const fetchProperties = async () => {
    const response = await fetch(`${API_BASE_URL}/properties`);
    if (!response.ok) {
        throw new Error('Failed to fetch properties');
    }
    return response.json();
};



export const deleteProperty = async (id, token) => {
    const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete property');
    }
    return response.json();
};







