const API_BASE_URL = 'http://localhost:5000/api';

export const fetchProperties = async () => {
    const response = await fetch(`${API_BASE_URL}/properties`);
    if (!response.ok) {
        throw new Error('Failed to fetch properties');
    }
    return response.json();
};