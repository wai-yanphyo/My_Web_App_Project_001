import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, CircularProgress, Alert } from '@mui/material';



const LoginPage = () => {
    

    

    return (
        <Container maxWidth="xs" sx={{ml:30,mt: 8, mb: 4, p: 4, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h4" component="h1" align="center" sx={{ mb: 3 }}>
                Login
            </Typography>
            <Box component="form" onSubmit={'ss'} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                    label="Email"
                    name="email"
                    type="email"
                    value={"DDD"}
                    onChange={"DDD"}
                    fullWidth
                    required
                />
                <TextField
                    label="Password"
                    name="password"
                    type="password"
                    value={'ddd'}
                    onChange={'ddddd'}
                    fullWidth
                    required
                />

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ p: 1.5, textTransform: 'none' }}
                    //disabled={loading}
                >
                </Button>
                <Button
                    variant="text"
                   
                    sx={{ textTransform: 'none' }}
                >
                    Don't have an account? Register
                </Button>
            </Box>
        </Container>
    );
};

export default LoginPage;
