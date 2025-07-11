
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container, Box, Typography, TextField, Button, CircularProgress, Alert,
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { createProperty,updateProperty,fetchPropertyById } from '../api/propertiesApi';
import useAuth from '../hooks/useAuth';



const PropertyFormPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const queryClient = useQueryClient();
    const { token } = useAuth(); 
    const [formValues, setFormValues] = useState({
        address: '',
        price: '',
        bedrooms: '',
        bathrooms: '',
        description: '',
        imageUrl: '',
    });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });






 const { data: property, isLoading: isPropertyLoading, isError: isPropertyError } = useQuery({
        queryKey: ['property', id],
        queryFn: () => fetchPropertyById(id, token),
        enabled: !!id,
        
    });

//to see old values in the edit forms------------
useEffect(() => {
        console.log("useEffect triggered. Current property data:", property);
        if (id && property) {
            console.log("Populating form with property data:", property); 
            setFormValues({
                address: property.address || '',
                price: (property.price !== null && property.price !== undefined) ? property.price.toString() : '',
                bedrooms: (property.bedrooms !== null && property.bedrooms !== undefined) ? property.bedrooms.toString() : '',
                bathrooms: (property.bathrooms !== null && property.bathrooms !== undefined) ? property.bathrooms.toString() : '',
                description: property.description || '',
                imageUrl: property.imageUrl || '',
            });
        }
    }, [id, property]);
//------------------------------------------------



//----------------Create to Api----------
     const createMutation = useMutation({
        mutationFn: (newProperty) => createProperty(newProperty, token),
        onSuccess: () => {
            queryClient.invalidateQueries(['properties']); 
            setSnackbar({ open: true, message: 'Property created successfully!', severity: 'success' });
            setTimeout(() => navigate('/'), 1500);
        },
        onError: (err) => {
            setSnackbar({ open: true, message: `Error creating property: ${err.message}`, severity: 'error' });
        },
    });
//-----------------------------------------------

//---------------For Update to Api------------
 const updateMutation = useMutation({
        mutationFn: (updatedPropertyData) => updateProperty(id, updatedPropertyData, token),
        onSuccess: () => {
            queryClient.invalidateQueries(['properties']); 
            queryClient.invalidateQueries(['property', id]);
            setSnackbar({ open: true, message: 'Property updated successfully!', severity: 'success' });
            setTimeout(() => navigate('/'), 1500);
        },
        onError: (err) => {
            setSnackbar({ open: true, message: `Error updating property: ${err.message}`, severity: 'error' });
        },
    });


//------------------------------

 const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };


     const handleSubmit = (e) => {
        e.preventDefault();
        if (!token) {
            setSnackbar({ open: true, message: 'You must be logged in to add/edit properties.', severity: 'warning' });
            return;
        }
        if (id) {
            updateMutation.mutate(formValues);
        }
        else {
            createMutation.mutate(formValues);
        }
    };

    if (id && isPropertyLoading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><CircularProgress /></Box>;
    }

    if (id && isPropertyError) {
        return <Alert severity="error">Error loading property for editing. Please try again.</Alert>;
    }


    return (
        <Container maxWidth="sm" sx={{ mt: 4, mb: 4, bgcolor: 'background.paper', p: 4, borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h4" component="h1" align="center" sx={{ mb: 3 }}>
                From 
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                    label="Address"
                    name="address"
                    value={formValues.address}
                    onChange={handleChange}
                    fullWidth
                    required
                    margin="normal"
                />
                <TextField
                    label="Price"
                    name="price"
                    type="number"
                    value={formValues.price}
                    onChange={handleChange}
                    fullWidth
                    required
                    margin="normal"
                />
                <TextField
                    label="Bedrooms"
                    name="bedrooms"
                    type="number"
                    value={formValues.bedrooms}
                    onChange={handleChange}
                    fullWidth
                    required
                    margin="normal"
                />
                <TextField
                    label="Bathrooms"
                    name="bathrooms"
                    type="number"
                    step="0.5" 
                    value={formValues.bathrooms}
                    onChange={handleChange}
                    fullWidth
                    required
                    margin="normal"
                />
                <TextField
                    label="Description"
                    name="description"
                    value={formValues.description}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    rows={4}
                    margin="normal"
                />
                <TextField
                    label="Image URL"
                    name="imageUrl"
                    value={formValues.imageUrl}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2, p: 1.5, textTransform: 'none' }}
                disabled={createMutation.isLoading || updateMutation.isLoading}

                    >
                    {(createMutation.isLoading || updateMutation.isLoading) ? <CircularProgress size={24} /> : (id ? 'Update Property' : 'Add Property')}
                </Button>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => navigate('/')}
                    sx={{ mt: 1, p: 1.5, textTransform: 'none' }}
                >
                    Cancel
                </Button>
            </Box>

           
        </Container>
    );
};

export default PropertyFormPage;
