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



export const fetchMyCustomerAppointments = async (token) => {
    const response = await fetch(`${API_BASE_URL}/appointments/my-customer-appointments`, {
       headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch your appointments');
    }
    return response.json();

    //     console.log("Fetching customer appointments with token:", token);
    // return [
    //     {
    //         id: 1,
    //         property: { address: "123 Main Street" },
    //         appointmentDate: new Date().toISOString(),
    //         status: "PENDING",
    //         agent: { email: "agent@example.com" }
    //     }
    // ];
};


export const fetchMyAgentAppointments = async (token) => {
    const response = await fetch(`${API_BASE_URL}/appointments/my-agent-appointments`, {
       headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(appointmentData),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch assigned appointments');
    }
    return response.json();
};

export const fetchAllAppointments = async (token) => {
    const response = await fetch(`${API_BASE_URL}/appointments`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch all appointments');
    }
    return response.json();
};


export const confirmAppointment = async (id, agentId, token) => {
    const response = await fetch(`${API_BASE_URL}/appointments/${id}/confirm`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ agentId }),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to confirm appointment');
    }
    return response.json();
};


export const updateAppointmentStatus = async (id, status, token) => {
    const response = await fetch(`${API_BASE_URL}/appointments/${id}/status`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to update appointment status to ${status}`);
    }
    return response.json();
};