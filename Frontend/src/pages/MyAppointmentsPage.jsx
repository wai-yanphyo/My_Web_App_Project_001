import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Container, Box, Typography, CircularProgress, Alert, Paper,Dialog,DialogTitle,DialogContent,DialogActions,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Button,
} from '@mui/material';
import { Cancel as CancelIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

import ConfirmationDialog from '../components/ConfirmationDialog';
import { fetchMyCustomerAppointments, fetchMyAgentAppointments ,updateAppointmentStatus} from '../api/appointmentApi';
//import useAuth from '../hooks/useAuth';

const statusLabels = {
    PENDING: 'Pending',
    CONFIRMED: 'Confirmed',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
};



const useAuth = {
    
        
            id: 2,
            role: 'CUSTOMER',
            email: 'test@example.com',
        };
  const tokens='fake-token';
   


const MyAppointmentsPage = () => {


    const navigate = useNavigate();
    // const { user, token } = useAuth();
    const user =useAuth;
    const token =tokens;
    const queryClient = useQueryClient();

    const [dialogInfo, setDialogInfo] = useState({ open: false, title: '', message: '', type: 'info', confirmAction: null });

    useEffect(() => {
        console.log(user);
        if (!user) { 
            setDialogInfo({ open: true, title: 'Access Denied', message: 'Please log in to view your appointments.', type: 'error',confirmAction: null});
            setTimeout(() => navigate('/login'), 1500); 
        } 
           else if(user?.role !== 'CUSTOMER' && user?.role !== 'AGENT') {
            setDialogInfo({ 
                open: true, 
                title: 'Access Denied',
                 message: 'You are not authorized to view this page.',
                  type: 'error' ,
                  });
            setTimeout(() => navigate('/'), 1500); 
        }
     }, [user, navigate]);
console.log(user?.role)


    const { data: customerAppointments, isLoading: isLoadingCustomer, isError: isErrorCustomer, error: errorCustomer } = useQuery({
        queryKey: ['myCustomerAppointments', 1],
        queryFn: () => fetchMyCustomerAppointments(token),
        enabled: user?.id === 2, 
    });

   


    

    const { data: agentAppointments, isLoading: isLoadingAgent, isError: isErrorAgent, error: errorAgent } = useQuery({
        queryKey: ['myAgentAppointments', user?.id],
        queryFn: () => fetchMyAgentAppointments(token),
        enabled: user?.role === 'AGENT',
    });

    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status }) => updateAppointmentStatus(id, status, token),
        onSuccess: () => {
            queryClient.invalidateQueries(['myCustomerAppointments']);
            queryClient.invalidateQueries(['myAgentAppointments']);
            queryClient.invalidateQueries(['appointments']); 
            setDialogInfo({ open: true, title: 'Success', message: 'Appointment status updated successfully!', type: 'success', confirmAction: null });
        },
        onError: (err) => {
            setDialogInfo({ open: true, title: 'Error', message: `Failed to update appointment status: ${err.message}`, type: 'error', confirmAction: null });
        },
    });

    const handleUpdateStatus = (appointmentId, newStatus) => {
        let title, message;
        if (newStatus === 'CANCELLED') {
            title = 'Confirm Cancellation';
            message = 'Are you sure you want to cancel this appointment?';
        } else if (newStatus === 'COMPLETED') {
            title = 'Confirm Completion';
            message = 'Are you sure you want to mark this appointment as completed?';
        }

        setDialogInfo({
            open: true,
            title: title,
            message: message,
            type: 'confirm',
            confirmAction: () => updateStatusMutation.mutate({ id: appointmentId, status: newStatus }),
        });
    };

        
    

    
    if (!user) {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                 <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><CircularProgress /></Box>
            </Container>
        );
    };

  
    if (user?.role !== 'CUSTOMER' && user?.role !== 'AGENT') {
        return null; 
    }

    if (user?.role === 'CUSTOMER' && (isLoadingCustomer || isErrorCustomer)) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><CircularProgress /></Box>;
    }
    if (user?.role === 'AGENT' && (isLoadingAgent || isErrorAgent)) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><CircularProgress /></Box>;
    }

    const appointmentsToDisplay = user?.role === 'CUSTOMER' ? customerAppointments : agentAppointments;
    const isCustomer = user?.role === 'CUSTOMER';
    const isAgent = user?.role === 'AGENT';

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
                My Appointments
            </Typography>

            {appointmentsToDisplay?.length === 0 ? (
                <Alert severity="info" sx={{ mt: 3, textAlign: 'center' }}>
                    {isCustomer ? "You don't have any appointments booked yet." : "You don't have any appointments assigned yet."}
                </Alert>
            ) : (
                <TableContainer component={Paper}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Property Address</TableCell>
                                <TableCell>Date</TableCell>
                                {isAgent && <TableCell>Customer</TableCell>}
                                {isCustomer && <TableCell>Assigned Agent</TableCell>}
                                <TableCell>Status</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {appointmentsToDisplay?.map((appointment) => (
                                <TableRow key={appointment.id}>
                                    <TableCell>{appointment.id}</TableCell>
                                    <TableCell>{appointment.property?.address || 'N/A'}</TableCell>
                                    <TableCell>{format(new Date(appointment.appointmentDate), 'PPP p')}</TableCell>
                                    {isAgent && <TableCell>{appointment.customer?.email || 'N/A'}</TableCell>}
                                    {isCustomer && <TableCell>{appointment.agent?.email || 'Not Assigned'}</TableCell>}
                                    <TableCell>{statusLabels[appointment.status]}</TableCell>
                                    <TableCell>
                                        {isCustomer && appointment.status === 'PENDING' && (
                                            <IconButton size="small" color="error" onClick={() => handleUpdateStatus(appointment.id, 'CANCELLED')}>
                                                <CancelIcon /> 
                                            </IconButton>
                                        )}
                                        {isAgent && appointment.status === 'CONFIRMED' && (
                                            <IconButton size="small" color="success" onClick={() => handleUpdateStatus(appointment.id, 'COMPLETED')}>
                                                <CheckCircleIcon /> 
                                            </IconButton>
                                        )}
                                       
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <ConfirmationDialog
                open={dialogInfo.open}
                onClose={() => setDialogInfo({ ...dialogInfo, open: false, confirmAction: null })}
                onConfirm={dialogInfo.confirmAction || (() => setDialogInfo({ ...dialogInfo, open: false }))}
                title={dialogInfo.title}
                message={dialogInfo.message}
                confirmText={dialogInfo.type === 'confirm' ? 'Yes, Proceed' : 'Ok'}
                cancelText={dialogInfo.type === 'confirm' ? 'Cancel' : undefined}
                confirmColor={dialogInfo.type === 'error' ? 'error' : (dialogInfo.type === 'warning' ? 'warning' : 'primary')}
            />

             
        </Container>
    );
};

export default MyAppointmentsPage;
