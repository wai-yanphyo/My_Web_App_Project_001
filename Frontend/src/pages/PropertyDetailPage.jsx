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
import { createAppointment } from '../api/appointmentApi';

import useAuth from '../hooks/useAuth';
import ConfirmationDialog from '../components/ConfirmationDialog';



const PropertyDetailPage = () => {


     const [open, setOpen] = useState(false);

    const { id } = useParams(); 
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { user, token } = useAuth();
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);


    const [openAppointmentDialog, setOpenAppointmentDialog] = useState(false);
    const [appointmentDate, setAppointmentDate] = useState('');
    const [dialogInfo, setDialogInfo] = useState({ open: false, title: '', message: '', type: 'info' });

 const { data: property, isLoading, isError, error } = useQuery({
        queryKey: ['property', id],
        queryFn: () => fetchPropertyById(id),
        enabled: !!id,
    });

//------------------Create Appointnt to Api---------------------
 const createAppointmentMutation = useMutation({
        mutationFn: (newAppointmentData) => createAppointment(newAppointmentData, token),
        onSuccess: () => {
            setDialogInfo({
                open: true,
                title: 'Appointment Requested!',
                message: 'Your appointment request has been sent successfully. The admin will review it soon.',
                type: 'success'
            });
                   console.log("Hi I am working now");

            setOpenAppointmentDialog(false); 
            setAppointmentDate(''); 
            queryClient.invalidateQueries(['myCustomerAppointments']);
        },
        onError: (err) => {
            setDialogInfo({
                open: true,
                title: 'Appointment Failed',
                message: `Error booking appointment: ${err.message}`,
                type: 'error'
            });
        },
    });

    const handleOpenAppointmentDialog = () => {
        if (!user || user.role !== 'CUSTOMER') {
            setDialogInfo({
                open: true,
                title: 'Action Not Allowed',
                message: 'You must be logged in as a Customer to request an appointment.',
                type: 'warning'
            });
            return;
        }
        setOpenAppointmentDialog(true);
    };

    const handleCloseAppointmentDialog = () => {
        setOpenAppointmentDialog(false);
        setAppointmentDate('');
    };

    const handleBookAppointment = () => {
        if (!appointmentDate) {
          console.error("Eror is I canoy see dialog box");
            setDialogInfo({ open: true, title: 'Input Required', message: 'Please select an appointment date.', type: 'warning' });
            return;
        }
        const selectedDate = parseISO(appointmentDate);
        if (!isFuture(selectedDate)) {
             setDialogInfo({ open: true, title: 'Invalid Date', message: 'Appointment date must be in the future.', type: 'warning' });
            return;
        }

        createAppointmentMutation.mutate({
            propertyId: parseInt(id),
            appointmentDate: selectedDate.toISOString(),
        });
    };
//------------------------------------------------



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


      {/* ---------For Dialog Box---------- */}

        {/* ------------Appoint Confirmation-------- */}
                  <Dialog open={open} onClose={() => {}}>
                  <DialogTitle>Request Appointment for 123 Main Street</DialogTitle>
                  <DialogContent>
                    <Typography gutterBottom>
                      Please select your preferred date and time for the appointment.
                    </Typography>
                    <TextField
                      type="datetime-local"
                      label="Appointment Date & Time"
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      fullWidth
                      margin="normal"
                      InputLabelProps={{ shrink: true }}
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => {setOpen(false)}} color="secondary">
                      Cancel
                    </Button>
                    <Button
                      onClick={handleBookAppointment}
                      color="primary"
                      variant="contained"
                      disabled={false}
                    >
                      Book Appointment
                    </Button>
                  </DialogActions>
                  </Dialog>
        {/* ---------------------------------------------- */}
        
        
         {/* ----------Confirmation Dialog for info and error----------- */}
                    <ConfirmationDialog
                        open={dialogInfo.open}
                        onClose={() => setDialogInfo({ ...dialogInfo, open: false })}
                        onConfirm={() => setDialogInfo({ ...dialogInfo, open: false })} // Just close for info/error
                        title={dialogInfo.title}
                        message={dialogInfo.message}
                        confirmText="Ok"
                        confirmColor={dialogInfo.type === 'error' ? 'error' : (dialogInfo.type === 'warning' ? 'warning' : 'primary')}
                    />
          {/* ---------------------------------------- */}



  
  </Container>



  );

};

export default PropertyDetailPage;






