const API_BASE_URL = 'http://localhost:5000/api';

export const fetchProperties = async (filters = {}) => {
    
    const queryParams = new URLSearchParams();
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
    if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
    if (filters.minBedrooms) queryParams.append('minBedrooms', filters.minBedrooms);
    if (filters.minBathrooms) queryParams.append('minBathrooms', filters.minBathrooms);


    
    const url =  `${API_BASE_URL}/properties?${queryParams.toString()}`;
    const response =await fetch(url);
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



export const createProperty = async (newProperty, token) => {
    const response = await fetch(`${API_BASE_URL}/properties`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newProperty),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create property');
    }
    return response.json();
};


export const updateProperty = async (id, updatedProperty, token) => {
    console.log("Token in updateProperty:", token);

    const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedProperty),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update property');
    }
    return response.json();
};

export const fetchPropertyById = async (id, token = null) => {
    if (!id) {
        throw new Error('Property ID is required to fetch a single property.');
    }

    const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
    };

    
    if (token) {
        // headers['Authorization'] = `Bearer ${token}`;
        //headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        console.log(`Attempting to fetch property with ID: ${id}`);
        const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
            method: 'GET',
            headers: headers, 
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'No additional error info.' }));
            const errorMessage = errorData.message || `Failed to fetch property: ${response.status} ${response.statusText}`;
            console.error(`Error fetching property ${id}:`, errorMessage);
            throw new Error(errorMessage);
        }

        const data = await response.json();
        console.log(`Successfully fetched property ${id}:`, data);
        return data;

    } catch (error) {
        console.error(`Network or parsing error for property ${id}:`, error);
        throw error; 
    }
};





