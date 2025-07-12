const API_BASE_URL = 'http://localhost:5000/api';


export const createAppointment = async (appointmentData, token) => {
    const response = await fetch(`${API_BASE_URL}/appointments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(appointmentData),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create appointment');
    }
    return response.json();
};