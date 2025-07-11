
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container, Box, Typography, TextField, Button, CircularProgress, Alert,
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { createProperty } from '../api/propertiesApi';
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
        else {
            createMutation.mutate(formValues);
        }
    };



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
                    >
                    {(createMutation.isLoading) ? <CircularProgress size={24} /> : ('Add Property')}
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
