import React, { useState } from 'react';
import {
    Container, Box, Typography, Button, Grid, CircularProgress, Alert,
    Dialog, DialogTitle, DialogContent, DialogActions,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';


import PropertyCard from '../components/PropertyCard'; 


const PropertyListPage = () => {
   
    const navigate = useNavigate();
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogTitle, setDialogTitle] = useState('');
    const [dialogMessage, setDialogMessage] = useState('');
    const [propertyToDeleteId, setPropertyToDeleteId] = useState(null);

  

  

  

    

 
    

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    Available Properties
                </Typography>
                { (
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/properties/new')}
                        sx={{ textTransform: 'none' }}
                    >
                        Add New Property
                    </Button>
                )}
            </Box>
            <Grid container spacing={3}>
               
                   
                            <PropertyCard
                                property={"Testing"}
                                onDelete={'dd'}                   
                                onEdit={() => {}}  
                            />
                            <PropertyCard
                                property={"Testing"}
                                onDelete={'dd'}            
                                onEdit={() => {}}
                            />
                            <PropertyCard
                                property={"Testing"}
                                onDelete={'dd'}                             
                                onEdit={() => {}}
                            />
                            <PropertyCard
                                property={"Testing"}
                                onDelete={'dd'}                             
                                onEdit={() => {}}
                            />
                    
                    
                

            
            </Grid>

                {/* <PropertyCard
            property={{
                id: 'static-1', // A unique ID for this static card
                address: '123 Test Street',
                price: 250000.00,
                bedrooms: 3,
                bathrooms: 2.5,
                description: 'A lovely static test property.',
                imageUrl: 'https://via.placeholder.com/600x400?text=Static+Property',
                // Add any other properties your PropertyCard component expects
            }}
            onDelete={() => console.log('Static delete clicked!')}
            onEdit={() => console.log('Static edit clicked!')}
            isAuthenticated={true} // Or false, depending on your test case
        /> */}
            

            {/* General purpose Dialog for Confirmation/Messages */}
            
        </Container>
    );
};

export default PropertyListPage;
