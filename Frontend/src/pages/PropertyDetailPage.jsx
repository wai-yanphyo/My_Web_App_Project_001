import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Pagination,Container, Box, Typography, Button, CircularProgress, Alert,
    Card, CardContent, CardMedia, Dialog, DialogTitle, DialogContent, DialogActions, TextField,Chip,
  Stack,Divider,Rating,List, ListItem, ListItemText, Avatar} from '@mui/material';
import { CalendarMonth as CalendarMonthIcon,Star as StarIcon  } from '@mui/icons-material';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import BedIcon from '@mui/icons-material/Bed';
import BathtubIcon from '@mui/icons-material/Bathtub';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Slider from 'react-slick';
import { parseISO, isFuture } from 'date-fns';

import { fetchPropertyById } from '../api/propertiesApi';
import useAuth from '../hooks/useAuth';



const PropertyDetailPage = () => {



    const { id } = useParams(); 
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { user, token } = useAuth();
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

 const { data: property, isLoading, isError, error } = useQuery({
        queryKey: ['property', id],
        queryFn: () => fetchPropertyById(id),
        enabled: !!id,
    });



      if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><CircularProgress /></Box>;
      if (isError) return <Alert severity="error">Error loading property details: {error.message}</Alert>;
      if (!property) return <Alert severity="info">Property not found.</Alert>;

    const fallbackImage = 'https://placehold.co/800x400/FF0000/FFFFFF?text=No+Image';

    const images = property.images?.length > 0 ? property.images : [
    'https://placehold.co/800x400/FF0000/FFFFFF?text=No+Image',
    'https://placehold.co/800x400/CCCCCC/000000?text=No+Image',
    'https://placehold.co/800x400/999999/FFFFFF?text=No+Image',
  ];

     

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };


  


  return(


<Container maxWidth="md" sx={{ mt: 4, mb: 4, bgcolor: 'background.paper', p: 4, borderRadius: 2, boxShadow: 1 }}>
            

       <Box
        sx={{
          '& .slick-prev, & .slick-next': {
            zIndex: 2,
            width: 50,
            height: 50,
          },
          '& .slick-prev:before, & .slick-next:before': {
            color: '#1976d2',
             fontSize: '40px', 
          },
          '& .slick-prev': {
            left: '5px',
            },
            '& .slick-next': {
                right: '5px',
                },
                    }}
                >
        <Slider {...settings}>
          {images.map((img, index) => (
            <Box
              key={index}
              component="img"
              src={img}
              alt={`Property Image ${index + 1}`}
              sx={{
                height: 400,
                width: '100%',
                objectFit: 'cover',
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://placehold.co/800x400/FF0000/FFFFFF?text=No+Image';
              }}
            />
          ))}
        </Slider>
      </Box>

      <CardContent sx={{ px: 4, py: 3 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          {property.address}
        </Typography>

        <Typography variant="h6" color="primary" gutterBottom>
          ${property.price.toLocaleString()}
        </Typography>

        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Chip
            icon={<BedIcon />}
            label={`${property.bedrooms} Bedrooms`}
            color="secondary"
            variant="outlined"
          />
          <Chip
            icon={<BathtubIcon />}
            label={`${property.bathrooms} Bathrooms`}
            color="secondary"
            variant="outlined"
          />
        </Stack>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          {property.description || 'No description available for this property.'}
        </Typography>

        {property.owner && (
          <Typography variant="caption" color="text.disabled" display="block" sx={{ mt: 1 }}>
            Listed by: {property.owner.email} (ID: {property.owner.id})
          </Typography>
        )}

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
         
          <Button
          variant="contained"
          startIcon={<CalendarMonthIcon />}
          onClick={handleOpen}
          disabled={false} // always enabled for static demo
        >
          Request Appointment
        </Button>

          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/')}
          >
            Back to Properties
          </Button>
        </Box>
      </CardContent>



  
  </Container>



  );

};

export default PropertyDetailPage;






