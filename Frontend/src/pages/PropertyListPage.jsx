import React, { useState } from 'react';
import {
    Container, Box, Typography, Button, Grid, CircularProgress, Alert,
    Dialog, DialogTitle, DialogContent, DialogActions,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';


import PropertyCard from '../components/PropertyCard'; 

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProperties,deleteProperty} from '../api/propertiesApi';


const PropertyListPage = () => {
   
    const navigate = useNavigate();
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogTitle, setDialogTitle] = useState('');
    const [dialogMessage, setDialogMessage] = useState('');
    const [propertyToDeleteId, setPropertyToDeleteId] = useState(null);
    const queryClient = useQueryClient();

//-------------------------Select------------------
     const { data: properties=[], isLoading, isError, error } = useQuery({
        queryKey: ['properties'],
        queryFn: fetchProperties,
    });
//---------------------------------------------------


//----------------------Delete---------------------
const deleteMutation = useMutation({
        mutationFn: (id) => deleteProperty(id, token),
        onSuccess: () => {
            queryClient.invalidateQueries(['properties']); 
            setDialogTitle('Success');
            setDialogMessage('Property deleted successfully!');
            setOpenDialog(true);
            setPropertyToDeleteId(null); 
        },
        onError: (err) => {
            setDialogTitle('Error');
            setDialogMessage(`Error deleting property: ${err.message}`);
            setOpenDialog(true);
        },
    });
//-----------------------------------------------------


//------------HandleDeleleteClick in Delete Button-----------------
const handleDeleteClick = (id) => {
        setPropertyToDeleteId(id);
        setDialogTitle('Confirm Deletion');
        setDialogMessage('Are you sure you want to delete this property? This action cannot be undone.');
        setOpenDialog(true);
    };
//------------------------------------------------


//--------------Confirm Delete Button-------------
 const confirmDelete = () => {
        if (propertyToDeleteId) {
            deleteMutation.mutate(propertyToDeleteId);
            setOpenDialog(false);
        }
    };
//------------------------------------------------


//-------------handleClosebutton for Dialog--------------------
 const handleDialogClose = () => {
        setOpenDialog(false);
        setPropertyToDeleteId(null);

    };
//---------------------------------------------------



  

  

    

 
    console.log(properties);//to test , remember to delte!

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
                {properties.length === 0 ? (
                    <Grid item xs={12}>
                        <Typography variant="h6" color="text.secondary" align="center">
                            No properties available.
                        </Typography>
                    </Grid>
                ):(
                    properties.map((property) => (
                        <Grid item xs={12} key={property.id}>
                            <PropertyCard
                                property={property}
                                onDelete={handleDeleteClick}                              
                                onEdit={() => "Md"}
                                
                            />
                        </Grid>
                    ))
                )

            }
            </Grid>

            <Dialog open={openDialog} onClose={handleDialogClose}>
                <DialogTitle>{dialogTitle}</DialogTitle>
                <DialogContent>
                    <Typography>{dialogMessage}</Typography>
                </DialogContent>
                <DialogActions>
                    
                    {propertyToDeleteId !== null ? (
                        <>
                            <Button onClick={handleDialogClose} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={confirmDelete} color="error" variant="contained">
                                Confirm
                            </Button>
                        </>
                    ) : (
                        
                        <Button onClick={handleDialogClose} color="primary" autoFocus>
                            Close
                        </Button>
                    )}
                </DialogActions>
            </Dialog>

        
              
            

           
            
        </Container>
    );
};

export default PropertyListPage;
