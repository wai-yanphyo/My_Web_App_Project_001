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
import { createComment, fetchCommentsForProperty } from '../api/commentApi';

import useAuth from '../hooks/useAuth';
import ConfirmationDialog from '../components/ConfirmationDialog';



const PropertyDetailPage = () => {

    const [page,setPage]=useState(1);
 const itemsPerPage =5;
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
    const [commentRatingForm, setCommentRatingForm] = useState({ rating: 0, comment: '' }); 

 const { data: property, isLoading, isError, error } = useQuery({
        queryKey: ['property', id],
        queryFn: () => fetchPropertyById(id),
        enabled: !!id,
    });

//------------------Create Appointnt to Api---------------------
 

 const {data: comments, isLoading : isLoadingComments, isError : isErrorComments, error : errorComments}=useQuery({
      queryKey : ['propertyComments',id],
      queryFn : () => fetchCommentsForProperty(id),
      enabled: !!id, //// Run only if id exists for example !!1=true !!'a' = true !!null = false !!0 = false !!underfined = fasle

});


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



//------------For Comment and Ratingss-----------

const createCommentMutation = useMutation({
          mutationFn: (data) => createComment(data, token),
          onSuccess: () => {
              queryClient.invalidateQueries(['propertyComments', id]);
              setDialogInfo({
                  open: true,
                  title: 'Comment Submitted!',
                  message: 'Your comment and rating have been added successfully.',
                  type: 'success'
              });
              setCommentRatingForm({ rating: 0, comment: '' });
          },
          onError: (err) => {
              setDialogInfo({
                  open: true,
                  title: 'Submission Failed',
                  message: `Error submitting comment: ${err.message}`,
                  type: 'error'
              });
          },
      });
  
      const handleCommentChange = (e) => {
          setCommentRatingForm({ ...commentRatingForm, comment: e.target.value });
      };
  
      const handleRatingChange = (event, newValue) => {
          setCommentRatingForm({ ...commentRatingForm, rating: newValue });
      };
  
      const handleSubmitComment = () => {
          console.log("User value:", user);

        
          if (commentRatingForm.rating === 0) {
              setDialogInfo({ open: true, title: 'Rating Required', message: 'Please give a star rating.', type: 'warning' });
              return;
          }
  
          createCommentMutation.mutate({
              propertyId: parseInt(id),
              rating: commentRatingForm.rating,
              comment: commentRatingForm.comment,
          });
      };
//------------------------------------



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





{/* -----------------For Comment and Rating ------------- */}
<Divider sx={{ my: 3 }} />

{/* STATIC: Comments and Ratings Section */}
<Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
    Customer Reviews ({comments?.length || 0})
</Typography>

{/* Leave a Review - Static */}
<Box sx={{ mb: 4, p: 2, border: '1px solid #e0e0e0', borderRadius: 2, bgcolor: 'background.paper' }}>
    <Typography variant="h6" gutterBottom>Leave a Review</Typography>
    <Rating
        name="property-rating"
        value={commentRatingForm.rating}
        onChange={handleRatingChange}
        precision={1}
        sx={{ mb: 1 }}
        emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
    />
    <TextField
        label="Your Comment (optional)"
        multiline
        rows={3}
        fullWidth
        // value="Hi"
        value={commentRatingForm.comment}
        // InputProps={{ readOnly:true}}
        onChange={handleCommentChange}
        sx={{ mb: 2 }}
    />
    <Button variant="contained" onClick={handleSubmitComment} disabled={createCommentMutation.isLoading || commentRatingForm.rating === 0}>  
     

      {createCommentMutation.isLoading ? <CircularProgress size={24} /> : 'Submit Review'}

    </Button>
</Box>




<List>
  
    {comments?.slice((page - 1) * itemsPerPage, page * itemsPerPage) .map((comment) => (
    <React.Fragment key={comment.id}>
      <ListItem alignItems="flex-start" sx={{ mb: 1 }}>
        <Avatar sx={{ mr: 2 }}>
          {comment.customer?.email?.charAt(0).toUpperCase() || 'A'}
        </Avatar>
        <ListItemText
          primary={
            <>
              <Typography component="span" variant="subtitle1" color="text.primary">
                {comment.customer?.email || 'Anonymous Customer'}
              </Typography>
              <Rating
                name={`rating-${comment.id}`}
                value={comment.rating}
                readOnly
                size="small"
                sx={{ ml: 1, verticalAlign: 'middle' }}
                emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
              />
            </>
          }
          secondary={
            <>
             
              <div style={{ 
              wordBreak: 'break-word', 
              whiteSpace: 'pre-wrap', 
              overflowWrap: 'anywhere' 
            }}>
             {comment.comment}
            </div>
              <Typography variant="caption" color="text.disabled">
                {new Date(comment.createdAt).toLocaleString() || ''}
              </Typography>
            </>
          }
        />
      </ListItem>
      <Divider variant="inset" component="li" />
    </React.Fragment>
  ))}
</List>

{comments && comments.length > itemsPerPage && (
  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
    <Pagination
      count={Math.ceil(comments.length / itemsPerPage)}
      page={page}
      onChange={(event, value) => setPage(value)}
      color="primary"
    />
  </Box>
)}

{/* ------------------------------------------------------ */}
  
  </Container>



  );

};

export default PropertyDetailPage;






