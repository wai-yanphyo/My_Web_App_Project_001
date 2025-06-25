
import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, CircularProgress, Alert } from '@mui/material';

const RegisterPage = () => {


    
    return (
        <Container maxWidth="xs" sx={{ mt: 8, mb: 4, p: 4, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h4" component="h1" align="center" sx={{ mb: 3 }}>
                Register
            </Typography>
            <Box component="form" onSubmit={'DDD'} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                    label="Email"
                    name="email"
                    type="email"
                    value={"sssss"}
                    onChange={'sssss'}
                    fullWidth
                    required
                />
                <TextField
                    label="Password"
                    name="password"
                    type="password"
                    value={'hahahah'}
                    onChange={'hahahha'}
                    fullWidth
                    required
                />
                
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ p: 1.5, textTransform: 'none' }}
                >
                    {/* {loading ? <CircularProgress size={24} /> : 'Register'} */}
                </Button>
                <Button
                    variant="text"
                    
                    sx={{ textTransform: 'none' }}
                >
                    Already have an account? Login
                </Button>
            </Box>
        </Container>
    );
};

export default RegisterPage;
