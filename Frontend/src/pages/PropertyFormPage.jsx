
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container, Box, Typography, TextField, Button, CircularProgress, Alert,
} from '@mui/material';

const PropertyFormPage = () => {
    const navigate = useNavigate();


    return (
        <Container maxWidth="sm" sx={{ mt: 4, mb: 4, bgcolor: 'background.paper', p: 4, borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h4" component="h1" align="center" sx={{ mb: 3 }}>
                From 
            </Typography>
            <Box component="form" onSubmit={'dd'} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                    label="Address"
                    name="address"
                    value={'aaa'}
                    onChange={'aaaa'}
                    fullWidth
                    required
                    margin="normal"
                />
                <TextField
                    label="Price"
                    name="price"
                    type="number"
                    value={'aaaassaa'}
                    onChange={'aadadad'}
                    fullWidth
                    required
                    margin="normal"
                />
                <TextField
                    label="Bedrooms"
                    name="bedrooms"
                    type="number"
                    value={'adadad'}
                    onChange={'adada'}
                    fullWidth
                    required
                    margin="normal"
                />
                <TextField
                    label="Bathrooms"
                    name="bathrooms"
                    type="number"
                    step="0.5" 
                    value={'adadad'}
                    onChange={'adadad'}
                    fullWidth
                    required
                    margin="normal"
                />
                <TextField
                    label="Description"
                    name="description"
                    value={'adada'}
                    onChange={'adadadad'}
                    fullWidth
                    multiline
                    rows={4}
                    margin="normal"
                />
                <TextField
                    label="Image URL"
                    name="imageUrl"
                    value={'adadadaq'}
                    onChange={'dadadwe'}
                    fullWidth
                    margin="normal"
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2, p: 1.5, textTransform: 'none' }}
                    // Disable button while mutations are in progress
                >
                    Add
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
