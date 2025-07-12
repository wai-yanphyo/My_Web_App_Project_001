import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Container, Box, Typography, CircularProgress, Alert, Paper, Tabs, Tab,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Button,
    MenuItem, Select, FormControl, InputLabel,Grid
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, CheckCircle as CheckCircleIcon, Assignment as AssignmentIcon, Cancel as CancelIcon, CalendarMonth as CalendarMonthIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

import useAuth from '../hooks/useAuth';
import { fetchProperties, deleteProperty } from '../api/propertiesApi';
import { fetchAllUsers, updateUserRole } from '../api/userApi';
import { confirmAppointment,fetchAllAppointments,updateAppointmentStatus} from '../api/appointmentApi';
import ConfirmationDialog from '../components/ConfirmationDialog';




const roleLabels = {
    CUSTOMER: 'Customer',
    AGENT: 'Agent',
    ADMIN: 'Admin',
};

const statusLabels = {
    PENDING: 'Pending',
    CONFIRMED: 'Confirmed',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
};


const AdminDashboardPage = () => {
    const navigate = useNavigate();
    
    const { user, token } = useAuth();
    

    const queryClient = useQueryClient();

    const [currentTab, setCurrentTab] = useState(0);
    const [dialogInfo, setDialogInfo] = useState({ open: false, title: '', message: '', type: 'info', confirmAction: null });
    const [tempAppointmentId, setTempAppointmentId] = useState(null);
    const [selectedAgent, setSelectedAgent] = useState('');
   

console.log(user?.role);
useEffect(() => {
    
    if (user && user?.role !== 'ADMIN') {
      setDialogInfo({
        open: true,
        title: 'Access Denied',
        message: 'You are not authorized to view the admin dashboard.',
        type: 'error',
      });

      setTimeout(() => navigate('/'), 1500);
    }
  }, [user, navigate]);
   

    const handleTabChange = (event, newValue) => {
        setCurrentTab(newValue);
        console.log(newValue);
    };

    // --- Data Queries ---
    const { data: properties, isLoading: isLoadingProperties, isError: isErrorProperties, error: errorProperties } = useQuery({
        queryKey: ['properties'],
        queryFn: fetchProperties,
        enabled: user?.role === 'ADMIN' && currentTab === 0,  //For Properties
    });

      const { data: users, isLoading: isLoadingUsers, isError: isErrorUsers, error: errorUsers } = useQuery({
        queryKey: ['users'],
        queryFn: () => fetchAllUsers(token),
        enabled: user?.role === 'ADMIN' && currentTab === 1,  //For Users
    });


    const { data: appointments, isLoading: isLoadingAppointments, isError: isErrorAppointments, error: errorAppointments } = useQuery({
        queryKey: ['appointments'],
        queryFn: () => fetchAllAppointments(token),
        enabled: user?.role === 'ADMIN' && currentTab === 2,   //For Appointments
    });

    //------------------------------------

    //------------------Mutatiom---------------------
   
    const deletePropertyMutation = useMutation({
        mutationFn: (id) => deleteProperty(id, token),
        onSuccess: () => {
            queryClient.invalidateQueries(['properties']);
            setDialogInfo({ open: true, title: 'Success', message: 'Property deleted successfully.', type: 'success', confirmAction: null });
        },
        onError: (err) => {
            setDialogInfo({ open: true, title: 'Error', message: `Error deleting property: ${err.message}`, type: 'error', confirmAction: null });
        },
    });


       const updateUserRoleMutation = useMutation({
        mutationFn: ({ id, role }) => updateUserRole(id, role, token),
        onSuccess: () => {
            queryClient.invalidateQueries(['users']);
            setDialogInfo({ open: true, title: 'Success', message: 'User role updated successfully.', type: 'success', confirmAction: null });
        },
        onError: (err) => {
            setDialogInfo({ open: true, title: 'Error', message: `Error updating user role: ${err.message}`, type: 'error', confirmAction: null });
        },
    });


     const confirmAppointmentMutation = useMutation({
        mutationFn: ({ id, agentId }) => confirmAppointment(id, agentId, token),
        onSuccess: () => {
            queryClient.invalidateQueries(['appointments']);
            setDialogInfo({ open: true, title: 'Success', message: 'Appointment confirmed and assigned.', type: 'success', confirmAction: null });
            setTempAppointmentId(null);
            setSelectedAgent('');
        },
        onError: (err) => {
            setDialogInfo({ open: true, title: 'Error', message: `Error confirming appointment: ${err.message}`, type: 'error', confirmAction: null });
        },
    });


     const updateAppointmentStatusMutation = useMutation({
        mutationFn: ({ id, status }) => updateAppointmentStatus(id, status, token),
        onSuccess: () => {
            queryClient.invalidateQueries(['appointments']);
            setDialogInfo({ open: true, title: 'Success', message: 'Appointment status updated.', type: 'success', confirmAction: null });
        },
        onError: (err) => {
            setDialogInfo({ open: true, title: 'Error', message: `Error updating appointment status: ${err.message}`, type: 'error', confirmAction: null });
        },
    });



    //--------------------------------------


  

    

   //=============Handles==============

//--- Handlers for Delete Property---
    const handleDeleteProperty = (id) => {
        setDialogInfo({
            open: true,
            title: 'Confirm Deletion',
            message: 'Are you sure you want to delete this property?',
            type: 'confirm',
            confirmAction: () => deletePropertyMutation.mutate(id),
        });
    };

//-------------------------------------

//----------Handles for changing users------
const handleChangeUserRole = (userId, newRole) => {
        if (userId === user.id && newRole !== user.role) {
            setDialogInfo({
                open: true,
                title: 'Action Not Allowed',
                message: 'You cannot change your own role from the dashboard.',
                type: 'warning',
                confirmAction: null,
            });
            return;
        }

        setDialogInfo({
            open: true,
            title: 'Confirm Role Change',
            message: `Are you sure you want to change this user's role to ${roleLabels[newRole]}?`,
            type: 'confirm',
            confirmAction: () => updateUserRoleMutation.mutate({ id: userId, role: newRole }),
        });
    };


const handleConfirmAppointment = (appointmentId) => {
        setTempAppointmentId(appointmentId);
        setSelectedAgent(''); 
        setDialogInfo({
            open: true,
            title: 'Confirm Appointment & Assign Agent',
            message: 'Confirm this appointment and optionally assign an agent:',
            type: 'custom_confirm_appointment', 
            confirmAction: null, 
        });
    };


const handleUpdateAppointmentStatus = (appointmentId, newStatus) => {
        setDialogInfo({
            open: true,
            title: `Confirm Status Change to ${statusLabels[newStatus]}`,
            message: `Are you sure you want to change the status of this appointment to ${statusLabels[newStatus]}?`,
            type: 'confirm',
            confirmAction: () => updateAppointmentStatusMutation.mutate({ id: appointmentId, status: newStatus }),
        });
    };



//---------------------------


    //====================================
   
    const availableAgents = users?.filter(u => u.role === 'AGENT') || [];

    const renderTabContent = () => {
        if (!user || user.role !== 'ADMIN') {
            return null; 
        }

        switch (currentTab) {
            case 0: // Properties
                if (isLoadingProperties) return <CircularProgress />;
                if (isErrorProperties) return <Alert severity="error">Error loading properties: {errorProperties.message}</Alert>;
                return (
                    <TableContainer component={Paper}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Address</TableCell>
                                    <TableCell>Price</TableCell>
                                    <TableCell>Bedrooms</TableCell>
                                    <TableCell>Bathrooms</TableCell>
                                    <TableCell>Owner Email</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {!Array.isArray(properties) ||properties.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center">No properties found.</TableCell>
                                    </TableRow>
                                ) : (
                                    properties.map((property) => (
                                        <TableRow key={property.id}>
                                            <TableCell>{property.id}</TableCell>
                                            <TableCell>{property.address}</TableCell>
                                            <TableCell>${property.price.toLocaleString()}</TableCell>
                                            <TableCell>{property.bedrooms}</TableCell>
                                            <TableCell>{property.bathrooms}</TableCell>
                                            <TableCell>{property.owner?.email || 'N/A'}</TableCell>
                                            <TableCell>
                                                {/* Admin can edit any property, but we navigate to standard form */}
                                                <IconButton size="small" onClick={() => navigate(`/properties/edit/${property.id}`)}>
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton size="small" onClick={() => handleDeleteProperty(property.id)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                );
            
                if (isLoadingAppointments) return <CircularProgress />;
                if (isErrorAppointments) return <Alert severity="error">Error loading appointments: {errorAppointments.message}</Alert>;
                return (
                    <TableContainer component={Paper}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Property</TableCell>
                                    <TableCell>Customer</TableCell>
                                    <TableCell>Agent</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {appointments.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center">No appointments found.</TableCell>
                                    </TableRow>
                                ) : (
                                    appointments.map((appointment) => (
                                        <TableRow key={appointment.id}>
                                            <TableCell>{appointment.id}</TableCell>
                                            <TableCell>{appointment.property.address}</TableCell>
                                            <TableCell>{appointment.customer.email}</TableCell>
                                            <TableCell>{appointment.agent?.email || 'Not Assigned'}</TableCell>
                                            <TableCell>{format(new Date(appointment.appointmentDate), 'PPP p')}</TableCell>
                                            <TableCell>{statusLabels[appointment.status]}</TableCell>
                                            <TableCell>
                                                {appointment.status === 'PENDING' && (
                                                    <IconButton size="small" color="primary" onClick={() => handleConfirmAppointment(appointment.id)}>
                                                        <CheckCircleIcon /> {/* Confirm / Assign */}
                                                    </IconButton>
                                                )}
                                                {appointment.status === 'CONFIRMED' && (
                                                    <IconButton size="small" color="success" onClick={() => handleUpdateAppointmentStatus(appointment.id, 'COMPLETED')}>
                                                        <CalendarMonthIcon /> {/* Mark Completed */}
                                                    </IconButton>
                                                )}
                                                {appointment.status !== 'CANCELLED' && (
                                                    <IconButton size="small" color="error" onClick={() => handleUpdateAppointmentStatus(appointment.id, 'CANCELLED')}>
                                                        <CancelIcon /> {/* Cancel */}
                                                    </IconButton>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                );
            case 1: // Users
                if (isLoadingUsers) return <CircularProgress />;
                if (isErrorUsers) return <Alert severity="error">Error loading users: {errorUsers.message}</Alert>;
                return (
                    <TableContainer component={Paper}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Role</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center">No users found.</TableCell>
                                    </TableRow>
                                ) : (
                                    users.map((u) => ( 
                                        <TableRow key={u.id}>
                                            <TableCell>{u.id}</TableCell>
                                            <TableCell>{u.email}</TableCell>
                                            <TableCell>
                                                <FormControl variant="standard" size="small">
                                                    <Select
                                                        value={u.role}
                                                        onChange={(e) => handleChangeUserRole(u.id, e.target.value)}
                                                        disabled={u.id === user.id} 
                                                    >
                                                        <MenuItem value="CUSTOMER">Customer</MenuItem>
                                                        <MenuItem value="AGENT">Agent</MenuItem>
                                                        <MenuItem value="ADMIN">Admin</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </TableCell>
                                            <TableCell>
                                                {/* Currently not  delete for users */}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                );
            case 2: // Appointments
                if (isLoadingAppointments) return <CircularProgress />;
                if (isErrorAppointments) return <Alert severity="error">Error loading appointments: {errorAppointments.message}</Alert>;
                return (
                    <TableContainer component={Paper}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Property</TableCell>
                                    <TableCell>Customer</TableCell>
                                    <TableCell>Agent</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {appointments.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center">No appointments found.</TableCell>
                                    </TableRow>
                                ) : (
                                    appointments.map((appointment) => (
                                        <TableRow key={appointment.id}>
                                            <TableCell>{appointment.id}</TableCell>
                                            <TableCell>{appointment.property.address}</TableCell>
                                            <TableCell>{appointment.customer.email}</TableCell>
                                            <TableCell>{appointment.agent?.email || 'Not Assigned'}</TableCell>
                                            <TableCell>{format(new Date(appointment.appointmentDate), 'PPP p')}</TableCell>
                                            <TableCell>{statusLabels[appointment.status]}</TableCell>
                                            <TableCell>
                                                {appointment.status === 'PENDING' && (
                                                    <IconButton size="small" color="primary" onClick={() => handleConfirmAppointment(appointment.id)}>
                                                        <CheckCircleIcon />
                                                    </IconButton>
                                                )}
                                                {appointment.status === 'CONFIRMED' && (
                                                    <IconButton size="small" color="success" onClick={() => handleUpdateAppointmentStatus(appointment.id, 'COMPLETED')}>
                                                        <CalendarMonthIcon /> 
                                                    </IconButton>
                                                )}
                                                {appointment.status !== 'CANCELLED' && (
                                                    <IconButton size="small" color="error" onClick={() => handleUpdateAppointmentStatus(appointment.id, 'CANCELLED')}>
                                                        <CancelIcon /> 
                                                    </IconButton>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                );
                default:
                return null;
        }
    };

   



const renderCustomConfirmAppointmentDialogContent = () => (
        <Box sx={{ mt: 2 }}>
            <Typography gutterBottom>
                Are you sure you want to confirm this appointment? You can also assign an agent now.
            </Typography>
            <FormControl fullWidth margin="normal">
                <InputLabel id="agent-select-label">Assign Agent (Optional)</InputLabel>
                <Select
                    labelId="agent-select-label"
                    value={selectedAgent}
                    label="Assign Agent (Optional)"
                    onChange={(e) => setSelectedAgent(e.target.value)}
                >
                    <MenuItem value="">
                        <em>No Agent</em>
                    </MenuItem>
                    {availableAgents.map((agent) => (
                        <MenuItem key={agent.id} value={agent.id}>
                            {agent.email}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );

// -------------------To acept requestiing appointment----------------
 const handleCustomConfirmAppointmentAction = () => {
        if (tempAppointmentId) {
            confirmAppointmentMutation.mutate({ id: tempAppointmentId, agentId: selectedAgent || null });
        }
        setDialogInfo({ ...dialogInfo, open: false });
    };
//---------------------------------------------------------------------------------

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
                Admin Dashboard
            </Typography>
            <Paper sx={{ width: '150%', mb: 2 }}>
                <Tabs value={currentTab} onChange={handleTabChange} aria-label="admin dashboard tabs" centered>
                    <Tab label="Propertie" />
                     <Tab label="Users" />
                    <Tab label="Properties" />

                   
                </Tabs>
            </Paper>
            <Box sx={{ width: '150%',p: 3, border: '1px solid #e0e0e0', borderRadius: 2 }}>
              
               
                <Grid item xs={12} md={8}>
                    {renderTabContent()}
                </Grid>
            </Box>

          
            <ConfirmationDialog
                open={dialogInfo.open}
                onClose={() => setDialogInfo({ ...dialogInfo, open: false, confirmAction: null })}
                onConfirm={dialogInfo.type === 'confirm' ? dialogInfo.confirmAction : (dialogInfo.type === 'custom_confirm_appointment' ? handleCustomConfirmAppointmentAction : () => setDialogInfo({ ...dialogInfo, open: false }))}
                title={dialogInfo.title}
                message={dialogInfo.message}
                confirmText={dialogInfo.type === 'confirm' ? 'Yes, proceed' : (dialogInfo.type === 'custom_confirm_appointment' ? 'Confirm & Assign' : 'Ok')}
                cancelText={dialogInfo.type === 'confirm' || dialogInfo.type === 'custom_confirm_appointment' ? 'Cancel' : undefined}
                confirmColor={dialogInfo.type === 'error' ? 'error' : (dialogInfo.type === 'warning' ? 'warning' : 'primary')}
            >
         {dialogInfo.type === 'custom_confirm_appointment' && renderCustomConfirmAppointmentDialogContent()}


            </ConfirmationDialog>
        </Container>
    );
};

export default AdminDashboardPage;
