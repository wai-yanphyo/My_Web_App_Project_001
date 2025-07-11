import React from 'react';
import { Card, CardContent, CardMedia, Box, Typography, IconButton, Button } from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import Visibility from '@mui/icons-material/Visibility';
import { Link } from 'react-router-dom';

const PropertyCard = ({ property, onDelete, onEdit, isAuthenticated }) => {
    const defaultImageUrl = 'https://placehold.co/600x400/FF0000/FFFFFF?text=No+Image';

    return (
        <Card sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, mb: 2 }}>
            <CardMedia
                component="img"
                sx={{ width: { xs: '100%', sm: 200 }, height: { xs: 200, sm: 'auto' }, objectFit: 'cover' }}
                image={property.imageUrl || defaultImageUrl}
                alt={property.address}
                onError={(e) => { e.target.onerror = null; e.target.src = defaultImageUrl; }} 
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <CardContent sx={{ flex: '1 0 auto' }}>
                    <Typography component="div" variant="h6">
                         {property.address}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" component="div">
                       Price: ${property.price.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Bedrooms: {1} | Bathrooms: {2}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Bedrooms: {property.bedrooms} | Bathrooms: {property.bathrooms}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1, justifyContent: 'flex-end' }}>
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Visibility/>}
                         component={Link}
                        to={`/properties/${property.id}`}
                       
                        sx={{ mr: 1 }}
                    >
                        View Details
                    </Button>
                    </Box>
                </CardContent>
            {isAuthenticated &&(

                    <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1, justifyContent: 'flex-end' }}>
                        <IconButton aria-label="edit" onClick={() => onEdit(property.id)}>
                            <EditIcon />
                        </IconButton>
                        <IconButton aria-label="delete" onClick={() => onDelete(property.id)}>
                            <DeleteIcon />
                        </IconButton>
                    </Box>
            )}
                
            </Box>
        </Card>
    );
};

export default PropertyCard;
